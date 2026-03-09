import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

/* =========================
   USERS TABLE
========================= */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


/* =========================
   TASKS TABLE
========================= */

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),

  // ⭐ link tasks to users
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  subject: text("subject").notNull(),
  description: text("description"),

  deadline: timestamp("deadline").notNull(),

  priority: text("priority")
    .notNull()
    .default("Medium"), // Low, Medium, High

  status: text("status")
    .notNull()
    .default("Pending"), // Pending, Completed

  createdAt: timestamp("created_at").defaultNow().notNull(),
});


/* =========================
   VALIDATION SCHEMAS
========================= */

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({
    id: true,
    userId: true,
    createdAt: true,
  })
  .extend({
    deadline: z.coerce.date(),
  });


/* =========================
   TYPES
========================= */

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type CreateTaskRequest = InsertTask;
export type UpdateTaskRequest = Partial<InsertTask>;