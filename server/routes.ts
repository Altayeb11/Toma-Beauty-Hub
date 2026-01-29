import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertArticleSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // 1. الحصول على قائمة المقالات (قراءة)
  app.get(api.articles.list.path, async (_req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  // 2. إضافة مقال جديد (كتابة - هذا هو الجزء الذي كان ناقصاً!)
  app.post(api.articles.list.path, async (req, res) => {
    try {
      const data = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(data);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "خطأ في بيانات المقال" });
    }
  });

  // 3. الحصول على مقال واحد
  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticle(Number(req.params.id));
    if (!article) return res.status(404).json({ message: "المقال غير موجود" });
    res.json(article);
  });

  // بقية المسارات (Sections, Routines, Tips)
  app.get(api.sections.list.path, async (_req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  app.get(api.routines.list.path, async (_req, res) => {
    const routines = await storage.getRoutines();
    res.json(routines);
  });

  app.get(api.remedies.list.path, async (_req, res) => {
    const remedies = await storage.getRemedies();
    res.json(remedies);
  });

  app.get(api.tips.list.path, async (_req, res) => {
    const tips = await storage.getTips();
    res.json(tips);
  });

  return httpServer;
}
