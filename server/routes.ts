import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Temporary login bypass (since Replit OAuth was removed)
  app.get("/api/login", (req, res) => {
    res.redirect("/dashboard");
  });

  // Get all tasks
  app.get(api.tasks.list.path, async (req: any, res) => {
    try {
      const status = req.query.status as "Pending" | "Completed" | undefined;
      const tasks = await storage.getTasks("local-user", status);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get a single task
  app.get(api.tasks.get.path, async (req: any, res) => {
    try {
      const task = await storage.getTask(Number(req.params.id), "local-user");

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
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask("local-user", input);
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
      const id = Number(req.params.id);

      const existingTask = await storage.getTask(id, "local-user");

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updates = api.tasks.update.input.parse(req.body);

      const updatedTask = await storage.updateTask(
        id,
        "local-user",
        updates
      );

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
      const id = Number(req.params.id);

      const existingTask = await storage.getTask(id, "local-user");

      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      await storage.deleteTask(id, "local-user");

      res.status(204).send();

    } catch (err) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  return httpServer;
}