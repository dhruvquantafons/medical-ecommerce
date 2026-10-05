import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { Address } from "@/data/types";
import { user } from "./auth-schema";

export * from "./auth-schema";

// All money is stored as integer paise (₹1 = 100) to avoid floating-point errors.

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const productForm = pgEnum("product_form", ["tablet", "capsule", "syrup", "cream", "drops", "powder", "device", "pack", "bottle"]);
export const orderStatus = pgEnum("order_status", ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"]);
export const paymentMethod = pgEnum("payment_method", ["online", "cod"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "failed", "cod"]);
export const rxStatus = pgEnum("rx_status", ["not_required", "pending", "approved", "rejected"]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("Pill"),
  color: text("color").notNull().default("#10847e"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    manufacturer: text("manufacturer").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    form: productForm("form").notNull(),
    packSize: text("pack_size").notNull(),
    mrpPaise: integer("mrp_paise").notNull(),
    pricePaise: integer("price_paise").notNull(),
    rxRequired: boolean("rx_required").notNull().default(false),
    composition: text("composition").notNull().default(""),
    description: text("description").notNull().default(""),
    uses: text("uses").array().notNull().default(sql`'{}'::text[]`),
    sideEffects: text("side_effects").array().notNull().default(sql`'{}'::text[]`),
    howToUse: text("how_to_use").notNull().default(""),
    safetyAdvice: text("safety_advice").array().notNull().default(sql`'{}'::text[]`),
    storage: text("storage").notNull().default(""),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    rating: real("rating").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    /** Inactive products are hidden from the store but kept for past orders. */
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("products_category_idx").on(t.categoryId), index("products_composition_idx").on(t.composition)],
);

/**
 * Product photos, in display order (the first is the main image). Each row is either an uploaded
 * file stored in `data` (served by /api/product-images/[id]) or an external https `url`.
 * Uploads start with a null `productId` ("staged") and are attached when the product is saved.
 */
export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    url: text("url"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    data: bytea("data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("product_images_product_idx").on(t.productId, t.sortOrder),
    check("product_images_source_check", sql`(${t.url} is null) <> (${t.data} is null)`),
  ],
);

export const addresses = pgTable(
  "addresses",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2").notNull().default(""),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    label: text("label", { enum: ["Home", "Work", "Other"] }).notNull().default("Home"),
    ...timestamps,
  },
  (t) => [index("addresses_user_idx").on(t.userId)],
);

export const prescriptions = pgTable(
  "prescriptions",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    data: bytea("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("prescriptions_user_idx").on(t.userId)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    status: orderStatus("status").notNull().default("placed"),
    paymentMethod: paymentMethod("payment_method").notNull(),
    paymentStatus: paymentStatus("payment_status").notNull(),
    rxStatus: rxStatus("rx_status").notNull().default("not_required"),
    rxNote: text("rx_note"),
    razorpayOrderId: text("razorpay_order_id").unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    couponCode: text("coupon_code"),
    itemCount: integer("item_count").notNull(),
    mrpTotalPaise: integer("mrp_total_paise").notNull(),
    subtotalPaise: integer("subtotal_paise").notNull(),
    couponDiscountPaise: integer("coupon_discount_paise").notNull().default(0),
    deliveryFeePaise: integer("delivery_fee_paise").notNull().default(0),
    totalPaise: integer("total_paise").notNull(),
    /** Snapshot of the delivery address at the time of ordering. */
    address: jsonb("address").$type<Omit<Address, "id">>().notNull(),
    /** Set once stock has been deducted, so payment callbacks and webhooks stay idempotent. */
    stockDeducted: boolean("stock_deducted").notNull().default(false),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("orders_user_idx").on(t.userId), index("orders_created_idx").on(t.createdAt), index("orders_status_idx").on(t.status)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    // Snapshot fields: what the customer actually bought, even if the product changes later.
    name: text("name").notNull(),
    packSize: text("pack_size").notNull(),
    rxRequired: boolean("rx_required").notNull(),
    qty: integer("qty").notNull(),
    pricePaise: integer("price_paise").notNull(),
    mrpPaise: integer("mrp_paise").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId), index("order_items_product_idx").on(t.productId)],
);

export const orderPrescriptions = pgTable(
  "order_prescriptions",
  {
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    prescriptionId: text("prescription_id")
      .notNull()
      .references(() => prescriptions.id, { onDelete: "restrict" }),
  },
  (t) => [primaryKey({ columns: [t.orderId, t.prescriptionId] })],
);

export const categoriesRelations = relations(categories, ({ many }) => ({ products: many(products) }));
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
}));
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  items: many(orderItems),
  prescriptions: many(orderPrescriptions),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
export const orderPrescriptionsRelations = relations(orderPrescriptions, ({ one }) => ({
  order: one(orders, { fields: [orderPrescriptions.orderId], references: [orders.id] }),
  prescription: one(prescriptions, { fields: [orderPrescriptions.prescriptionId], references: [prescriptions.id] }),
}));

// ---- Employees (admin-managed team members)

export const employees = pgTable("employees", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull().default(""),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});
