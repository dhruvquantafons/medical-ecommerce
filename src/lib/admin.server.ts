import "server-only";
import { and, asc, count, desc, eq, ilike, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, orderItems, orderPrescriptions, orders, prescriptions, productImages, products, user } from "@/db/schema";
import type { OrderStatus, PaymentStatus } from "@/data/types";
import { productImageUrls, toProduct } from "./catalog";
import { productImagePath } from "./files";
import { getOrderDetail } from "./orders.server";

export const PAGE_SIZE = 20;
export const LOW_STOCK = 10;

const rupees = (paise: number | null | undefined) => (paise ?? 0) / 100;
const like = (q: string) => `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
const offset = (page: number) => (Math.max(1, page) - 1) * PAGE_SIZE;

/** Orders that count as real sales: cash on delivery, or online and actually paid. */
const realOrder = or(eq(orders.paymentMethod, "cod"), eq(orders.paymentStatus, "paid"))!;
const notCancelled = ne(orders.status, "cancelled");
const istDate = (col: SQL | typeof orders.createdAt) => sql`(${col} at time zone 'Asia/Kolkata')::date`;
const todayIst = sql`(now() at time zone 'Asia/Kolkata')::date`;

// ---- Dashboard

export async function getDashboard() {
  const revenue = sql<number>`coalesce(sum(${orders.totalPaise}), 0)::int`;
  const [[today], [last30], [pendingRx], [toFulfil], [customers], [lowStockCount], lowStock, daily, recent] = await Promise.all([
    db
      .select({ revenue, orders: count() })
      .from(orders)
      .where(and(realOrder, notCancelled, eq(istDate(orders.createdAt), todayIst))),
    db
      .select({ revenue, orders: count() })
      .from(orders)
      .where(and(realOrder, notCancelled, sql`${istDate(orders.createdAt)} > ${todayIst} - 30`)),
    db.select({ n: count() }).from(orders).where(and(realOrder, notCancelled, eq(orders.rxStatus, "pending"))),
    db.select({ n: count() }).from(orders).where(and(realOrder, inArray(orders.status, ["placed", "confirmed", "packed"]))),
    db.select({ n: count() }).from(user).where(or(sql`${user.role} is null`, ne(user.role, "admin"))),
    db.select({ n: count() }).from(products).where(and(eq(products.active, true), lte(products.stock, LOW_STOCK))),
    db
      .select({ id: products.id, name: products.name, stock: products.stock })
      .from(products)
      .where(and(eq(products.active, true), lte(products.stock, LOW_STOCK)))
      .orderBy(asc(products.stock), asc(products.name))
      .limit(6),
    db.execute<{ day: string; revenue: number; orders: number }>(sql`
      select to_char(d.day, 'YYYY-MM-DD') as day,
             coalesce(sum(o.total_paise), 0)::int as revenue,
             count(o.id)::int as orders
      from generate_series(${todayIst} - 13, ${todayIst}, interval '1 day') as d(day)
      left join ${orders} o
        on (o.created_at at time zone 'Asia/Kolkata')::date = d.day
       and o.status <> 'cancelled'
       and (o.payment_method = 'cod' or o.payment_status = 'paid')
      group by d.day
      order by d.day`),
    listOrders({ page: 1 }, 8),
  ]);

  return {
    today: { revenue: rupees(today.revenue), orders: today.orders },
    last30: { revenue: rupees(last30.revenue), orders: last30.orders },
    pendingRx: pendingRx.n,
    toFulfil: toFulfil.n,
    customers: customers.n,
    lowStockCount: lowStockCount.n,
    lowStock,
    daily: [...daily].map((d) => ({ day: d.day, revenue: rupees(d.revenue), orders: d.orders })),
    recent: recent.rows,
  };
}

// ---- Orders

export interface OrderListFilters {
  status?: OrderStatus;
  payment?: PaymentStatus;
  q?: string;
  page: number;
}

export async function listOrders(f: OrderListFilters, limit = PAGE_SIZE) {
  const where: SQL[] = [];
  if (f.status) where.push(eq(orders.status, f.status));
  if (f.payment) where.push(eq(orders.paymentStatus, f.payment));
  if (f.q) where.push(or(ilike(orders.id, like(f.q)), ilike(user.email, like(f.q)), ilike(user.name, like(f.q)))!);
  const cond = where.length ? and(...where) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: orders.id,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        rxStatus: orders.rxStatus,
        totalPaise: orders.totalPaise,
        itemCount: orders.itemCount,
        createdAt: orders.createdAt,
        customerName: user.name,
        customerEmail: user.email,
        userId: user.id,
      })
      .from(orders)
      .innerJoin(user, eq(orders.userId, user.id))
      .where(cond)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset(f.page)),
    db.select({ total: count() }).from(orders).innerJoin(user, eq(orders.userId, user.id)).where(cond),
  ]);
  return {
    rows: rows.map((r) => ({ ...r, total: rupees(r.totalPaise), createdAt: r.createdAt.toISOString() })),
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
export type AdminOrderRow = Awaited<ReturnType<typeof listOrders>>["rows"][number];

export async function getAdminOrder(id: string) {
  const order = await getOrderDetail(id);
  if (!order) return null;
  const [customer] = await db.select({ id: user.id, name: user.name, email: user.email }).from(user).where(eq(user.id, order.userId));
  return { order, customer };
}

/** Orders waiting for a pharmacist to review their prescription. */
export async function listRxQueue() {
  const rows = await db
    .select({ id: orders.id, createdAt: orders.createdAt, customerName: user.name, customerEmail: user.email, status: orders.status })
    .from(orders)
    .innerJoin(user, eq(orders.userId, user.id))
    .where(and(realOrder, notCancelled, eq(orders.rxStatus, "pending")))
    .orderBy(asc(orders.createdAt));
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const [items, files] = await Promise.all([
    db
      .select({ orderId: orderItems.orderId, name: orderItems.name, qty: orderItems.qty })
      .from(orderItems)
      .where(and(inArray(orderItems.orderId, ids), eq(orderItems.rxRequired, true))),
    db
      .select({ orderId: orderPrescriptions.orderId, id: prescriptions.id, name: prescriptions.fileName, type: prescriptions.mimeType })
      .from(orderPrescriptions)
      .innerJoin(prescriptions, eq(orderPrescriptions.prescriptionId, prescriptions.id))
      .where(inArray(orderPrescriptions.orderId, ids)),
  ]);
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    rxItems: items.filter((i) => i.orderId === r.id),
    files: files.filter((f) => f.orderId === r.id).map((f) => ({ id: f.id, name: f.name, type: f.type, url: `/api/prescriptions/${f.id}` })),
  }));
}

// ---- Products and categories

export interface ProductListFilters {
  q?: string;
  category?: number;
  status?: "active" | "inactive" | "low";
  page: number;
}

export async function listAdminProducts(f: ProductListFilters) {
  const where: SQL[] = [];
  if (f.q) where.push(or(ilike(products.name, like(f.q)), ilike(products.brand, like(f.q)), ilike(products.composition, like(f.q)))!);
  if (f.category) where.push(eq(products.categoryId, f.category));
  if (f.status === "active") where.push(eq(products.active, true));
  if (f.status === "inactive") where.push(eq(products.active, false));
  if (f.status === "low") where.push(and(eq(products.active, true), lte(products.stock, LOW_STOCK))!);
  const cond = where.length ? and(...where) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({ product: products, categoryName: categories.name, categorySlug: categories.slug, images: productImageUrls })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(cond)
      .orderBy(desc(products.createdAt), asc(products.id))
      .limit(PAGE_SIZE)
      .offset(offset(f.page)),
    db.select({ total: count() }).from(products).where(cond),
  ]);
  return {
    rows: rows.map((r) => ({ ...toProduct({ ...r.product, categorySlug: r.categorySlug, images: r.images }), active: r.product.active, categoryName: r.categoryName })),
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAdminProduct(id: string) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!row) return null;
  const images = await db
    .select({ id: productImages.id, url: productImages.url })
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.sortOrder), asc(productImages.createdAt));
  return { ...row, images: images.map((i) => ({ id: i.id, src: i.url ?? productImagePath(i.id), external: !!i.url })) };
}

export async function listAdminCategories() {
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      icon: categories.icon,
      color: categories.color,
      sortOrder: categories.sortOrder,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}
export type AdminCategory = Awaited<ReturnType<typeof listAdminCategories>>[number];

// ---- Customers

const orderStats = db
  .select({
    userId: orders.userId,
    orderCount: sql<number>`count(*)::int`.as("order_count"),
    spentPaise: sql<number>`coalesce(sum(${orders.totalPaise}) filter (where ${orders.status} <> 'cancelled'), 0)::int`.as("spent_paise"),
    lastOrderAt: sql<Date>`max(${orders.createdAt})`.as("last_order_at"),
  })
  .from(orders)
  .where(realOrder)
  .groupBy(orders.userId)
  .as("order_stats");

export async function listCustomers(f: { q?: string; page: number }) {
  const cond = f.q ? or(ilike(user.name, like(f.q)), ilike(user.email, like(f.q))) : undefined;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
        orderCount: sql<number>`coalesce(${orderStats.orderCount}, 0)`,
        spentPaise: sql<number>`coalesce(${orderStats.spentPaise}, 0)`,
      })
      .from(user)
      .leftJoin(orderStats, eq(orderStats.userId, user.id))
      .where(cond)
      .orderBy(desc(user.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset(f.page)),
    db.select({ total: count() }).from(user).where(cond),
  ]);
  return {
    rows: rows.map((r) => ({ ...r, spent: rupees(r.spentPaise), createdAt: r.createdAt.toISOString() })),
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getCustomer(id: string) {
  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!row) return null;
  const list = await db
    .select({
      id: orders.id,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      rxStatus: orders.rxStatus,
      totalPaise: orders.totalPaise,
      itemCount: orders.itemCount,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, id))
    .orderBy(desc(orders.createdAt));
  const real = list.filter((o) => o.paymentMethod === "cod" || o.paymentStatus === "paid");
  return {
    customer: {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      banned: !!row.banned,
      banReason: row.banReason,
      createdAt: row.createdAt.toISOString(),
    },
    orders: list.map((o) => ({
      ...o,
      customerName: row.name,
      customerEmail: row.email,
      userId: row.id,
      total: rupees(o.totalPaise),
      createdAt: o.createdAt.toISOString(),
    })),
    stats: {
      orders: real.length,
      spent: rupees(real.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalPaise, 0)),
    },
  };
}
