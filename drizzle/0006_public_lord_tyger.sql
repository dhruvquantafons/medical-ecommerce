CREATE TABLE "mr_folder_images" (
	"id" text PRIMARY KEY NOT NULL,
	"folder_id" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"file_name" text DEFAULT '' NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"data" "bytea" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_folders" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mr_folders_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "mr_folder_images" ADD CONSTRAINT "mr_folder_images_folder_id_mr_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."mr_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mr_folders" ADD CONSTRAINT "mr_folders_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mr_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mr_folder_images_folder_idx" ON "mr_folder_images" USING btree ("folder_id","sort_order");--> statement-breakpoint
CREATE INDEX "mr_folders_parent_idx" ON "mr_folders" USING btree ("parent_id","sort_order");