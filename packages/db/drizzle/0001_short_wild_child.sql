CREATE TABLE IF NOT EXISTS "PBXKK_phoneverification" (
	"phone" text PRIMARY KEY NOT NULL,
	"code" text,
	"requested_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PBXKK_phonetokens" (
	"token" text PRIMARY KEY NOT NULL,
	"phone" text,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "PBXKK_guests" DROP CONSTRAINT "PBXKK_guests_userId_PBXKK_user_id_fk";
--> statement-breakpoint
ALTER TABLE "PBXKK_user" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "PBXKK_guests" DROP COLUMN IF EXISTS "userId";