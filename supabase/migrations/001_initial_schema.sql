-- Portfolio & Blog Schema
-- Migration 001: Initial Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUM TYPES
-- ===========================================

CREATE TYPE project_status AS ENUM ('dev', 'concluido', 'pausado', 'arquivado');
CREATE TYPE article_status AS ENUM ('draft', 'published');
CREATE TYPE technology_category AS ENUM ('language', 'framework', 'lib', 'db', 'tool', 'other');
CREATE TYPE content_language AS ENUM ('pt-BR', 'en');

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- TECHNOLOGIES TABLE
-- ===========================================

CREATE TABLE public.technologies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_class TEXT,
    color_hex TEXT DEFAULT '#000000' NOT NULL,
    category technology_category DEFAULT 'other' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_technologies_category ON public.technologies(category);
CREATE INDEX idx_technologies_is_active ON public.technologies(is_active);

-- ===========================================
-- PROJECTS TABLE
-- ===========================================

CREATE TABLE public.projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    short_description TEXT,
    full_description TEXT,
    cover_image_url TEXT,
    repo_url TEXT,
    deploy_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    status project_status DEFAULT 'dev' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    language content_language DEFAULT 'pt-BR' NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_is_active ON public.projects(is_active);
CREATE INDEX idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_language ON public.projects(language);
CREATE INDEX idx_projects_display_order ON public.projects(display_order);

-- ===========================================
-- PROJECT_TECHNOLOGIES (Junction Table)
-- ===========================================

CREATE TABLE public.project_technologies (
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    technology_id BIGINT NOT NULL REFERENCES public.technologies(id) ON DELETE RESTRICT,
    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_project_technologies_project ON public.project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology ON public.project_technologies(technology_id);

-- ===========================================
-- PROJECT_IMAGES TABLE
-- ===========================================

CREATE TABLE public.project_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_project_images_project ON public.project_images(project_id);
CREATE INDEX idx_project_images_display_order ON public.project_images(display_order);

-- ===========================================
-- TAGS TABLE
-- ===========================================

CREATE TABLE public.tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color_hex TEXT DEFAULT '#000000' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tags_slug ON public.tags(slug);

-- ===========================================
-- PROJECT_TAGS (Junction Table)
-- ===========================================

CREATE TABLE public.project_tags (
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE INDEX idx_project_tags_project ON public.project_tags(project_id);
CREATE INDEX idx_project_tags_tag ON public.project_tags(tag_id);

-- ===========================================
-- CATEGORIES TABLE
-- ===========================================

CREATE TABLE public.categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color_hex TEXT DEFAULT '#000000' NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

-- ===========================================
-- ARTICLES TABLE
-- ===========================================

CREATE TABLE public.articles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    summary TEXT,
    excerpt TEXT,
    cover_image_url TEXT,
    status article_status DEFAULT 'draft' NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    reading_time_minutes INT,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    language content_language DEFAULT 'pt-BR' NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT[],
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_language ON public.articles(language);
CREATE INDEX idx_articles_published_at ON public.articles(published_at);

-- ===========================================
-- ARTICLE_TAGS (Junction Table)
-- ===========================================

CREATE TABLE public.article_tags (
    article_id BIGINT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_article ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);

-- ===========================================
-- ARTICLE_PROJECTS (Junction Table)
-- Articles can mention/link to projects
-- ===========================================

CREATE TABLE public.article_projects (
    article_id BIGINT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, project_id)
);

CREATE INDEX idx_article_projects_article ON public.article_projects(article_id);
CREATE INDEX idx_article_projects_project ON public.article_projects(project_id);

-- ===========================================
-- TRIGGER: Auto-update updated_at
-- ===========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- TRIGGER: Auto-set published_at when article is published
-- ===========================================

CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_article_published_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

-- ===========================================
-- FUNCTION: Calculate reading time
-- ===========================================

CREATE OR REPLACE FUNCTION public.calculate_reading_time(content TEXT)
RETURNS INT AS $$
DECLARE
    word_count INT;
    words_per_minute INT := 200;
BEGIN
    -- Simple word count (approximate)
    word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
    RETURN GREATEST(1, CEIL(word_count::NUMERIC / words_per_minute));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate reading time
CREATE OR REPLACE FUNCTION public.update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time_minutes = public.calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_article_reading_time
    BEFORE INSERT OR UPDATE OF content ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.update_reading_time();

-- ===========================================
-- FUNCTION: Increment view count
-- ===========================================

CREATE OR REPLACE FUNCTION public.increment_project_views(project_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.projects
    SET views_count = views_count + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_article_views(article_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.articles
    SET views_count = views_count + 1
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
