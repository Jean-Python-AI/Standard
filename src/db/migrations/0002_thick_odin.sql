DROP INDEX `habit_logs_date_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `habit_date` ON `habit_logs` (`habit_id`,`date`);