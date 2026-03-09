import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";

function getUserId(req: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // temporary login redirect
  app.get("/api/login", (req, res) => {
    res.redirect("/dashboard");
  });

  // Get all tasks
  app.get(api.tasks.list.path, async (req: any, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const status = req.query.status as "Pending" | "Completed" | undefined;

      const tasks = await storage.getTasks(userId, status);

      res.json(tasks);

    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get(api.tasks.get.path, async (req: any, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const task = await storage.getTask(Number(req.params.id), userId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);

    } catch (err) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create task
  app.post(api.tasks.create.path, async (req: any, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const input = api.tasks.create.input.parse(req.body);

      const task = await storage.createTask(userId, input);

      res.status(201).json(task);

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Update task
  app.put(api.tasks.update.path, async (req: any, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = Number(req.params.id);

      const existingTask = await storage.getTask(id, userId);

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updates = api.tasks.update.input.parse(req.body);

      const updatedTask = await storage.updateTask(id, userId, updates);

      res.json(updatedTask);

    } catch (err) {

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete task
  app.delete(api.tasks.delete.path, async (req: any, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = Number(req.params.id);

      const existingTask = await storage.getTask(id, userId);

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      await storage.deleteTask(id, userId);

      res.status(204).send();

    } catch (err) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  return httpServer;
}