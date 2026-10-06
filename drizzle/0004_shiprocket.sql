ALTER TABLE "orders" ADD COLUMN "shiprocket_order_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shiprocket_shipment_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "awb_code" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pickup_requested" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "label_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipment_status" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipment_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_awb_code_unique" UNIQUE("awb_code");