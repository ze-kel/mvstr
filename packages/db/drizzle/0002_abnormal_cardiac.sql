ALTER TABLE "PBXKK_tasks" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "PBXKK_tasks" DROP CONSTRAINT "PBXKK_tasks_id_PBXKK_events_id_fk";
--> statement-breakpoint
ALTER TABLE "PBXKK_tasks" DROP CONSTRAINT "PBXKK_tasks_userId_PBXKK_user_id_fk";
--> statement-breakpoint
ALTER TABLE "PBXKK_tasks" ADD COLUMN "event_id" text NOT NULL;--> statement-breakpoint
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
