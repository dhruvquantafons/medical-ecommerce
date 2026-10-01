CREATE TABLE "product_images" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"url" text,
	"mime_type" text,
	"size_bytes" integer,
	"data" "bytea",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_source_check" CHECK (("product_images"."url" is null) <> ("product_images"."data" is null))
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_images_product_idx" ON "product_images" USING btree ("product_id","sort_order");--> statement-breakpoint
-- Keep existing single image URLs as each product's first photo.
INSERT INTO "product_images" ("id", "product_id", "sort_order", "url")
SELECT gen_random_uuid()::text, "id", 0, "image_url" FROM "products" WHERE "image_url" IS NOT NULL AND "image_url" <> '';--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image_url";