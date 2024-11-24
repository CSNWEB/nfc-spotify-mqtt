CREATE TABLE `api_keys` (
	`id` integer PRIMARY KEY NOT NULL,
	`service` text NOT NULL,
	`key` text,
	`secret` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_service_unique` ON `api_keys` (`service`);--> statement-breakpoint
CREATE TABLE `tag_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tag_id` text NOT NULL,
	`name` text,
	`spotify_type` text,
	`spotify_id` text,
	`spotify_image` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_assignments_tag_id_unique` ON `tag_assignments` (`tag_id`);