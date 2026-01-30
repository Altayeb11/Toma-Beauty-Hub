import { useQuery } from "@tanstack/react-query";

// Type definitions
export interface Article {
  id: string;
  title: string;
  content: string;
  language: "en" | "ar";
  createdAt: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  steps: string[];
  language: "en" | "ar";
  createdAt: string;
}

export interface Remedy {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  language: "en" | "ar";
  createdAt: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Tip {
  id: string;
  content: string;
}

export function useSections() {
  return useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const res = await fetch("/api/sections");
      if (!res.ok) throw new Error("Failed to fetch sections");
      return await res.json() as Section[];
    },
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles");
      if (!res.ok) throw new Error("Failed to fetch articles");
      return await res.json() as Article[];
    },
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch article");
      return await res.json() as Article;
    },
    enabled: !!id,
  });
}

export function useRoutines() {
  return useQuery({
    queryKey: ["routines"],
    queryFn: async () => {
      const res = await fetch("/api/routines");
      if (!res.ok) throw new Error("Failed to fetch routines");
      return await res.json() as Routine[];
    },
  });
}

export function useRemedy(id: string) {
  return useQuery({
    queryKey: ["remedies", id],
    queryFn: async () => {
      const res = await fetch(`/api/remedies/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch remedy");
      return await res.json() as Remedy;
    },
    enabled: !!id,
  });
}

export function useRemedies() {
  return useQuery({
    queryKey: ["remedies"],
    queryFn: async () => {
      const res = await fetch("/api/remedies");
      if (!res.ok) throw new Error("Failed to fetch remedies");
      return await res.json() as Remedy[];
    },
  });
}

export function useTips() {
  return useQuery({
    queryKey: ["tips"],
    queryFn: async () => {
      const res = await fetch("/api/tips");
      if (!res.ok) throw new Error("Failed to fetch tips");
      return await res.json() as Tip[];
    },
  });
}
