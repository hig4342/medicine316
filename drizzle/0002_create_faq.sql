CREATE TABLE `faq` (
	`id` text PRIMARY KEY NOT NULL,
	`priority` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faq_i18n` (
	`faq_id` text NOT NULL,
	`language` text DEFAULT 'ko' NOT NULL,
	`question` text DEFAULT '' NOT NULL,
	`content` text,
	PRIMARY KEY(`faq_id`, `language`),
	FOREIGN KEY (`faq_id`) REFERENCES `faq`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `faq_i18n_language_idx` ON `faq_i18n` (`language`);