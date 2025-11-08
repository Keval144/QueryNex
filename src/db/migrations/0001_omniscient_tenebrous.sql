ALTER TABLE "message" ADD COLUMN "sender_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_message_sender_id" ON "message" USING btree ("sender_id");