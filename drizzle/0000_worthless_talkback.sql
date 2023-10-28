CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY NOT NULL,
	`season` integer,
	`episode` integer,
	`title` text,
	`description` text,
	`airDate` text,
	`imdbRating` text,
	`totalVotes` integer,
	`directedBy` text,
	`writtenBy` text,
	`episode_clip_url` text
);
--> statement-breakpoint
CREATE TABLE `extras` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`photo_url` text,
	`video_url` text
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY NOT NULL,
	`quote` text,
	`character` text,
	`character_avatar_url` text
);
--> statement-breakpoint
CREATE TABLE `trivia` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text,
	`answer` text
);
