import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryAr: text("summary_ar").notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(true),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  stepsEn: jsonb("steps_en").notNull(),
  stepsAr: jsonb("steps_ar").notNull(),
});

export const remedies = pgTable("remedies", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  ingredientsEn: jsonb("ingredients_en").notNull(),
  ingredientsAr: jsonb("ingredients_ar").notNull(),
  instructionsEn: text("instructions_en").notNull(),
  instructionsAr: text("instructions_ar").notNull(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
});

// إعدادات الـ Zod والأنواع
export const insertUserSchema = createInsertSchema(users);
export const insertArticleSchema = createInsertSchema(articles);
export const insertSectionSchema = createInsertSchema(sections);
export const insertRoutineSchema = createInsertSchema(routines);
export const insertRemedySchema = createInsertSchema(remedies);
export const insertTipSchema = createInsertSchema(tips);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Section = typeof sections.$inferSelect;
export type Routine = typeof routines.$inferSelect;
export type Remedy = typeof remedies.$inferSelect;
export type Tip = typeof tips.$inferSelect;
