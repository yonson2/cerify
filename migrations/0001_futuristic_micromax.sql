ALTER TABLE `session` ADD `refresh_token` text NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `token_expiration` integer NOT NULL;