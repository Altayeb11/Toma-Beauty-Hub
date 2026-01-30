// API Routes Configuration (no longer needed for Supabase frontend-only)
// This file is kept for backwards compatibility only

export const api = {
  sections: {
    list: {
      method: 'GET' as const,
      path: '/api/sections',
    },
  },
  articles: {
    list: {
      method: 'GET' as const,
      path: '/api/articles',
    },
    get: {
      method: 'GET' as const,
      path: '/api/articles/:id',
    },
  },
  routines: {
    list: {
      method: 'GET' as const,
      path: '/api/routines',
    },
  },
  remedies: {
    list: {
      method: 'GET' as const,
      path: '/api/remedies',
    },
  },
  tips: {
    list: {
      method: 'GET' as const,
      path: '/api/tips',
    },
  },
};
