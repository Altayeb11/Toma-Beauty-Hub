import {
  users,
  articles,
  sections,
  tips,
  type User,
  type InsertUser,
  type Article,
  type InsertArticle,
  type Section,
  type Tip,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // مستخدمين
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // مقالات (هذا ما سيجعلها تظهر للجميع)
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getSections(): Promise<Section[]> {
    return await db.select().from(sections);
  }

  async getTips(): Promise<Tip[]> {
    return await db.select().from(tips);
  }
}

export const storage = new DatabaseStorage();
