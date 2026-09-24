ALTER TABLE "users" ADD COLUMN "hashed_password" varchar DEFAULT 'unset' NOT NULL;--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "hashed_password";