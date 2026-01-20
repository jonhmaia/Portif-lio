-- Portfolio & Blog RLS Policies
-- Migration 002: Row Level Security

-- ===========================================
-- Enable RLS on all tables
-- ===========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_projects ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Public can view profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ===========================================
-- TECHNOLOGIES POLICIES
-- ===========================================

-- Public can view active technologies
CREATE POLICY "Active technologies are viewable by everyone"
    ON public.technologies FOR SELECT
    USING (is_active = true);

-- Authenticated users can view all technologies
CREATE POLICY "Authenticated users can view all technologies"
    ON public.technologies FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated users can insert technologies
CREATE POLICY "Authenticated users can insert technologies"
    ON public.technologies FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only authenticated users can update technologies
CREATE POLICY "Authenticated users can update technologies"
    ON public.technologies FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated users can delete technologies
CREATE POLICY "Authenticated users can delete technologies"
    ON public.technologies FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- PROJECTS POLICIES
-- ===========================================

-- Public can view active projects
CREATE POLICY "Active projects are viewable by everyone"
    ON public.projects FOR SELECT
    USING (is_active = true);

-- Authenticated users can view all projects
CREATE POLICY "Authenticated users can view all projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Only authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- PROJECT_TECHNOLOGIES POLICIES
-- ===========================================

-- Public can view project technologies
CREATE POLICY "Project technologies are viewable by everyone"
    ON public.project_technologies FOR SELECT
    USING (true);

-- Only authenticated users can manage project technologies
CREATE POLICY "Authenticated users can insert project technologies"
    ON public.project_technologies FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project technologies"
    ON public.project_technologies FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- PROJECT_IMAGES POLICIES
-- ===========================================

-- Public can view project images
CREATE POLICY "Project images are viewable by everyone"
    ON public.project_images FOR SELECT
    USING (true);

-- Only authenticated users can manage project images
CREATE POLICY "Authenticated users can insert project images"
    ON public.project_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update project images"
    ON public.project_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project images"
    ON public.project_images FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- TAGS POLICIES
-- ===========================================

-- Public can view all tags
CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT
    USING (true);

-- Only authenticated users can manage tags
CREATE POLICY "Authenticated users can insert tags"
    ON public.tags FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
    ON public.tags FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tags"
    ON public.tags FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- PROJECT_TAGS POLICIES
-- ===========================================

-- Public can view project tags
CREATE POLICY "Project tags are viewable by everyone"
    ON public.project_tags FOR SELECT
    USING (true);

-- Only authenticated users can manage project tags
CREATE POLICY "Authenticated users can insert project tags"
    ON public.project_tags FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project tags"
    ON public.project_tags FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- CATEGORIES POLICIES
-- ===========================================

-- Public can view all categories
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Authenticated users can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- ARTICLES POLICIES
-- ===========================================

-- Public can view published articles
CREATE POLICY "Published articles are viewable by everyone"
    ON public.articles FOR SELECT
    USING (status = 'published');

-- Authenticated users can view all articles
CREATE POLICY "Authenticated users can view all articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (author_id = auth.uid());

-- Authors can update their own articles
CREATE POLICY "Authors can update their own articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

-- Authors can delete their own articles
CREATE POLICY "Authors can delete their own articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (author_id = auth.uid());

-- ===========================================
-- ARTICLE_TAGS POLICIES
-- ===========================================

-- Public can view article tags
CREATE POLICY "Article tags are viewable by everyone"
    ON public.article_tags FOR SELECT
    USING (true);

-- Only authenticated users can manage article tags
CREATE POLICY "Authenticated users can insert article tags"
    ON public.article_tags FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete article tags"
    ON public.article_tags FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- ARTICLE_PROJECTS POLICIES
-- ===========================================

-- Public can view article projects
CREATE POLICY "Article projects are viewable by everyone"
    ON public.article_projects FOR SELECT
    USING (true);

-- Only authenticated users can manage article projects
CREATE POLICY "Authenticated users can insert article projects"
    ON public.article_projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete article projects"
    ON public.article_projects FOR DELETE
    TO authenticated
    USING (true);

-- ===========================================
-- GRANT PUBLIC ACCESS TO INCREMENT FUNCTIONS
-- ===========================================

GRANT EXECUTE ON FUNCTION public.increment_project_views(BIGINT) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_article_views(BIGINT) TO anon;
