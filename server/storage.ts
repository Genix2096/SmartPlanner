import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  tasks,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type Task,
} from "@shared/schema";

export interface IStorage {
  getTasks(userId: string, status?: "Pending" | "Completed"): Promise<Task[]>;
  getTask(id: number, userId: string): Promise<Task | undefined>;
  createTask(userId: string, task: CreateTaskRequest): Promise<Task>;
  updateTask(id: number, userId: string, updates: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(userId: string, status?: "Pending" | "Completed"): Promise<Task[]> {
    const conditions = [eq(tasks.userId, userId)];
    if (status) {
      conditions.push(eq(tasks.status, status));
    }
    return await db.select().from(tasks).where(and(...conditions));
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task;
  }

  async createTask(userId: string, insertTask: CreateTaskRequest): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({ ...insertTask, userId })
      .returning();
    return task;
  }

  async updateTask(id: number, userId: string, updates: UpdateTaskRequest): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    
    return updatedTask;
  }

  async deleteTask(id: number, userId: string): Promise<void> {
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
