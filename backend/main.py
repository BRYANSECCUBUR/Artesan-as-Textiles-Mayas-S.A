"""
Artesanias y Textiles Mayas, S.A. - Backend API
Fase 3 (P3) - FastAPI + Oracle Database (python-oracledb, thin mode)
"""

import os
from datetime import date
from typing import Optional

import oracledb
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "1521")
DB_SERVICE = os.getenv("DB_SERVICE", "XEPDB1")

DSN = f"{DB_HOST}:{DB_PORT}/{DB_SERVICE}"

# python-oracledb runs in "thin" mode by default: no Oracle Instant Client needed.
pool = None


def get_pool():
    """Lazily creates a connection pool to Oracle (reused across requests)."""
    global pool
    if pool is None:
        pool = oracledb.create_pool(
            user=DB_USER,
            password=DB_PASSWORD,
            dsn=DSN,
            min=1,
            max=5,
            increment=1,
        )
    return pool


app = FastAPI(title="Artesanias y Textiles Mayas S.A. - API", version="1.0.0")

# Allows the static frontend (served separately by nginx) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your real frontend origin before going to production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class OrderDetailIn(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class OrderIn(BaseModel):
    customer_id: int
    details: list[OrderDetailIn]


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    """Verifies the API can actually reach Oracle, not just that FastAPI is up."""
    try:
        with get_pool().acquire() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM dual")
                cur.fetchone()
        return {"status": "ok", "database": "connected", "dsn": DSN}
    except oracledb.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------

@app.get("/categories")
def list_categories():
    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT category_id, category_name, description FROM categories ORDER BY category_name")
            cols = [c[0].lower() for c in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]


@app.get("/products")
def list_products(category_id: Optional[int] = None):
    query = """
        SELECT p.product_id, p.product_name, p.unit_price, p.stock_quantity,
               c.category_name, a.full_name AS artisan_name
        FROM products p
        JOIN categories c ON c.category_id = p.category_id
        LEFT JOIN artisans a ON a.artisan_id = p.artisan_id
        WHERE p.product_status = 'ACTIVE'
    """
    params = {}
    if category_id is not None:
        query += " AND p.category_id = :category_id"
        params["category_id"] = category_id
    query += " ORDER BY p.product_name"

    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            cols = [c[0].lower() for c in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]


# ---------------------------------------------------------------------------
# Sales
# ---------------------------------------------------------------------------

@app.post("/sales-orders")
def create_sales_order(order: OrderIn):
    """Creates an order + its detail lines, then asks Oracle to calculate totals via
    the sp_calculate_order_totals stored procedure (single source of truth for the IVA math)."""
    if not order.details:
        raise HTTPException(status_code=400, detail="The order needs at least one product line")

    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            order_id_var = cur.var(int)
            cur.execute(
                """
                INSERT INTO sales_orders (customer_id, order_status)
                VALUES (:customer_id, 'PENDING')
                RETURNING order_id INTO :order_id
                """,
                {"customer_id": order.customer_id, "order_id": order_id_var},
            )
            order_id = order_id_var.getvalue()[0]

            for line in order.details:
                cur.execute(
                    """
                    INSERT INTO sales_order_details (order_id, product_id, quantity, unit_price, line_subtotal)
                    VALUES (:order_id, :product_id, :quantity, :unit_price, :quantity * :unit_price)
                    """,
                    {
                        "order_id": order_id,
                        "product_id": line.product_id,
                        "quantity": line.quantity,
                        "unit_price": line.unit_price,
                    },
                )

            cur.callproc("sp_calculate_order_totals", [order_id])
            conn.commit()

            cur.execute(
                "SELECT order_id, subtotal, iva_amount, total_amount FROM sales_orders WHERE order_id = :id",
                {"id": order_id},
            )
            row = cur.fetchone()
            return {
                "order_id": row[0],
                "subtotal": row[1],
                "iva_amount": row[2],
                "total_amount": row[3],
            }


@app.post("/sales-orders/{order_id}/invoice")
def generate_invoice(order_id: int):
    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            try:
                cur.callproc("sp_generate_invoice", [order_id])
                conn.commit()
            except oracledb.DatabaseError as e:
                raise HTTPException(status_code=400, detail=str(e))

            cur.execute(
                "SELECT invoice_number, invoice_date, subtotal, iva_amount, total_amount "
                "FROM invoices WHERE order_id = :id",
                {"id": order_id},
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Invoice was not created")
            return {
                "invoice_number": row[0],
                "invoice_date": row[1],
                "subtotal": row[2],
                "iva_amount": row[3],
                "total_amount": row[4],
            }


# ---------------------------------------------------------------------------
# Reports (Sales & Accounting) - both use the SYS_REFCURSOR procedures
# ---------------------------------------------------------------------------

@app.get("/reports/sales")
def sales_report(start_date: date, end_date: date):
    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            ref_cursor = conn.cursor()
            cur.callproc("sp_sales_report", [start_date, end_date, ref_cursor])
            cols = [c[0].lower() for c in ref_cursor.description]
            return [dict(zip(cols, row)) for row in ref_cursor.fetchall()]


@app.get("/reports/trial-balance")
def trial_balance():
    with get_pool().acquire() as conn:
        with conn.cursor() as cur:
            ref_cursor = conn.cursor()
            cur.callproc("sp_trial_balance", [ref_cursor])
            cols = [c[0].lower() for c in ref_cursor.description]
            return [dict(zip(cols, row)) for row in ref_cursor.fetchall()]
