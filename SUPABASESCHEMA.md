-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.article_tags (
  article_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT article_tags_pkey PRIMARY KEY (article_id, tag_id),
  CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id),
  CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  title text NOT NULL,
  slug text NOT NULL CHECK (char_length(slug) > 0),
  description text NOT NULL,
  body text,
  meta_description text,
  hero_image_id uuid,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT articles_hero_image_id_fkey FOREIGN KEY (hero_image_id) REFERENCES public.images(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL,
  content text NOT NULL,
  author_name text,
  author_email text,
  author_ip text,
  is_anonymous boolean NOT NULL DEFAULT true,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id)
);
CREATE TABLE public.images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bucket_id text,
  object_key text,
  url text,
  width integer,
  height integer,
  mime_type text,
  is_cached boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  CONSTRAINT images_pkey PRIMARY KEY (id)
);
CREATE TABLE public.remedies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  title text NOT NULL,
  slug text NOT NULL CHECK (char_length(slug) > 0),
  description text NOT NULL,
  preparation text NOT NULL,
  meta_description text,
  hero_image_id uuid,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  CONSTRAINT remedies_pkey PRIMARY KEY (id),
  CONSTRAINT remedies_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT remedies_hero_image_id_fkey FOREIGN KEY (hero_image_id) REFERENCES public.images(id)
);
CREATE TABLE public.remedy_ingredients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  remedy_id uuid NOT NULL,
  ingredient_order integer NOT NULL,
  name text NOT NULL,
  quantity text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT remedy_ingredients_pkey PRIMARY KEY (id),
  CONSTRAINT remedy_ingredients_remedy_id_fkey FOREIGN KEY (remedy_id) REFERENCES public.remedies(id)
);
CREATE TABLE public.routine_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL,
  step_order integer NOT NULL,
  title text,
  content text NOT NULL,
  duration_minutes integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT routine_steps_pkey PRIMARY KEY (id),
  CONSTRAINT routine_steps_routine_id_fkey FOREIGN KEY (routine_id) REFERENCES public.routines(id)
);
CREATE TABLE public.routines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  title text NOT NULL,
  slug text NOT NULL CHECK (char_length(slug) > 0),
  description text,
  meta_description text,
  hero_image_id uuid,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  CONSTRAINT routines_pkey PRIMARY KEY (id),
  CONSTRAINT routines_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT routines_hero_image_id_fkey FOREIGN KEY (hero_image_id) REFERENCES public.images(id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);