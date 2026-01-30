// @ts-ignore - JS module, no type definitions
import { supabase } from "./supabase";

// Type definitions (for database tables)
interface Article {
  id?: string;
  title: string;
  content: string;
  language: "en" | "ar";
  createdAt?: string;
}

interface Routine {
  id?: string;
  title: string;
  description: string;
  steps: string[];
  language: "en" | "ar";
  createdAt?: string;
}

interface Remedy {
  id?: string;
  name: string;
  description: string;
  ingredients: string[];
  language: "en" | "ar";
  createdAt?: string;
}

/**
 * Supabase Client Wrapper
 * All CRUD operations for Articles, Routines, Remedies
 */

// ============ ARTICLES ============

export async function fetchArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw new Error(`Failed to fetch articles: ${error.message}`);
  return data;
}

export async function createArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("articles")
    .insert([article])
    .select();

  if (error) throw new Error(`Failed to create article: ${error.message}`);
  return data?.[0];
}

export async function updateArticle(id: number, updates: Partial<Article>) {
  const { data, error } = await supabase
    .from("articles")
    .update({ ...updates, updatedAt: new Date() })
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to update article: ${error.message}`);
  return data?.[0];
}

export async function deleteArticle(id: number) {
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete article: ${error.message}`);
}

// ============ ROUTINES ============

export async function fetchRoutines() {
  const { data, error } = await supabase
    .from("routines")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw new Error(`Failed to fetch routines: ${error.message}`);
  return data;
}

export async function createRoutine(routine: Omit<Routine, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("routines")
    .insert([routine])
    .select();

  if (error) throw new Error(`Failed to create routine: ${error.message}`);
  return data?.[0];
}

export async function updateRoutine(id: number, updates: Partial<Routine>) {
  const { data, error } = await supabase
    .from("routines")
    .update({ ...updates, updatedAt: new Date() })
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to update routine: ${error.message}`);
  return data?.[0];
}

export async function deleteRoutine(id: number) {
  const { error } = await supabase
    .from("routines")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete routine: ${error.message}`);
}

// ============ REMEDIES ============

export async function fetchRemedies() {
  const { data, error } = await supabase
    .from("remedies")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw new Error(`Failed to fetch remedies: ${error.message}`);
  return data;
}

export async function createRemedy(remedy: Omit<Remedy, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("remedies")
    .insert([remedy])
    .select();

  if (error) throw new Error(`Failed to create remedy: ${error.message}`);
  return data?.[0];
}

export async function updateRemedy(id: number, updates: Partial<Remedy>) {
  const { data, error } = await supabase
    .from("remedies")
    .update({ ...updates, updatedAt: new Date() })
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to update remedy: ${error.message}`);
  return data?.[0];
}

export async function deleteRemedy(id: number) {
  const { error } = await supabase
    .from("remedies")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete remedy: ${error.message}`);
}

// ============ AUTHENTICATION ============

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Login failed: ${error.message}`);
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Logout failed: ${error.message}`);
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Failed to get user: ${error.message}`);
  return data.user;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(`Failed to get session: ${error.message}`);
  return data.session;
}
