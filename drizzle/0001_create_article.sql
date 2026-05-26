CREATE TABLE `article` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`priority` real DEFAULT 0 NOT NULL,
	`parent_id` text,
	`reading_time` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `article_slug_idx` ON `article` (`slug`);--> statement-breakpoint
CREATE TABLE `article_i18n` (
	`article_id` text NOT NULL,
	`language` text DEFAULT 'ko' NOT NULL,
	`title` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '{}' NOT NULL,
	PRIMARY KEY(`article_id`, `language`),
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `article_i18n_language_idx` ON `article_i18n` (`language`);