import { users, articles, sections, routines, remedies, tips, type User, type InsertUser, type Article, type InsertArticle, type Section, type Routine, type Remedy, type Tip } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;

  getSections(): Promise<Section[]>;
  getSection(key: string): Promise<Section | undefined>;

  getRoutines(): Promise<Routine[]>;
  getRemedies(): Promise<Remedy[]>;
  getTips(): Promise<Tip[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: pool as any,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async getSections(): Promise<Section[]> {
    return await db.select().from(sections);
  }

  async getSection(key: string): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.key, key));
    return section;
  }

  async getRoutines(): Promise<Routine[]> {
    return await db.select().from(routines);
  }

  async getRemedies(): Promise<Remedy[]> {
    return await db.select().from(remedies);
  }

  async getTips(): Promise<Tip[]> {
    return await db.select().from(tips);
  }
}

export const storage = new DatabaseStorage();
