ALTER TABLE "refresh_tokens" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "chirps" DROP COLUMN "revoked_at";