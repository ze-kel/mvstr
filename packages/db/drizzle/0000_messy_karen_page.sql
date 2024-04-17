CREATE TABLE IF NOT EXISTS "PBXKK_events" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"place" text,
	"date" timestamp,
	"time" text,
	"description" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_guests" (
	"id" text NOT NULL,
	"type" text,
	"userId" text,
	"phone" text,
	"role" text DEFAULT 'guest'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time" timestamp,
	"completed" boolean,
	"parent_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_user" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text,
	"vk_id" text,
	"email" text,
	"first_name" text,
	"last_name" text,
	"profile_image" text,
	"birthday_vk" text,
	"vk_connected" boolean,
	"vk_token" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_wishes" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"link" text,
	"image_url" text,
	"title" text,
	"price" text,
	"descriptions" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_events" ADD CONSTRAINT "PBXKK_events_userId_PBXKK_user_id_fk" FOREIGN KEY ("userId") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_guests" ADD CONSTRAINT "PBXKK_guests_id_PBXKK_events_id_fk" FOREIGN KEY ("id") REFERENCES "PBXKK_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_guests" ADD CONSTRAINT "PBXKK_guests_userId_PBXKK_user_id_fk" FOREIGN KEY ("userId") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_session" ADD CONSTRAINT "PBXKK_session_user_id_PBXKK_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_event_id_PBXKK_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "PBXKK_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_user_id_PBXKK_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_parent_id_PBXKK_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "PBXKK_tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_wishes" ADD CONSTRAINT "PBXKK_wishes_userId_PBXKK_user_id_fk" FOREIGN KEY ("userId") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
