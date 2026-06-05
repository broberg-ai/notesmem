CREATE TABLE `adapters` (
	`name` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`url` text,
	`token` text,
	`method` text DEFAULT 'POST' NOT NULL,
	`field_mapping` text,
	`in_default_fanout` integer DEFAULT true NOT NULL
);
