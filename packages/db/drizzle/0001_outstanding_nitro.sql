CREATE TABLE IF NOT EXISTS "PBXKK_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time" timestamp,
	"completed" boolean,
	"parent_id" text
);
--> statement-breakpoint
DROP TABLE "PBXKK_test";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_id_PBXKK_events_id_fk" FOREIGN KEY ("id") REFERENCES "PBXKK_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_userId_PBXKK_user_id_fk" FOREIGN KEY ("userId") REFERENCES "PBXKK_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PBXKK_tasks" ADD CONSTRAINT "PBXKK_tasks_parent_id_PBXKK_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "PBXKK_tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
