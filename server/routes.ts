import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.tasks.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const status = req.query.status as "Pending" | "Completed" | undefined;
      const tasks = await storage.getTasks(req.user.claims.sub, status);
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get(api.tasks.get.path, isAuthenticated, async (req: any, res) => {
    try {
      const task = await storage.getTask(Number(req.params.id), req.user.claims.sub);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post(api.tasks.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(req.user.claims.sub, input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put(api.tasks.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const existingTask = await storage.getTask(id, req.user.claims.sub);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updates = api.tasks.update.input.parse(req.body);
      const updatedTask = await storage.updateTask(id, req.user.claims.sub, updates);
      res.json(updatedTask);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete(api.tasks.delete.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const existingTask = await storage.getTask(id, req.user.claims.sub);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      await storage.deleteTask(id, req.user.claims.sub);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  return httpServer;
}
