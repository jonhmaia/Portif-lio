-- ===========================================
-- TRANSLATIONS TABLES
-- Sistema de tradução bilíngue PT-BR/EN
-- ===========================================

-- ===========================================
-- PROJECT TRANSLATIONS
-- ===========================================

CREATE TABLE public.project_translations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    language content_language NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    short_description TEXT,
    full_description TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(project_id, language)
);

CREATE INDEX idx_project_translations_project ON public.project_translations(project_id);
CREATE INDEX idx_project_translations_language ON public.project_translations(language);

-- Trigger para updated_at
CREATE TRIGGER update_project_translations_updated_at
    BEFORE UPDATE ON public.project_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ARTICLE TRANSLATIONS
-- ===========================================

CREATE TABLE public.article_translations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    language content_language NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    excerpt TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(article_id, language)
);

CREATE INDEX idx_article_translations_article ON public.article_translations(article_id);
CREATE INDEX idx_article_translations_language ON public.article_translations(language);

-- Trigger para updated_at
CREATE TRIGGER update_article_translations_updated_at
    BEFORE UPDATE ON public.article_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- CATEGORY TRANSLATIONS
-- ===========================================

CREATE TABLE public.category_translations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    language content_language NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(category_id, language)
);

CREATE INDEX idx_category_translations_category ON public.category_translations(category_id);
CREATE INDEX idx_category_translations_language ON public.category_translations(language);

-- Trigger para updated_at
CREATE TRIGGER update_category_translations_updated_at
    BEFORE UPDATE ON public.category_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TAG TRANSLATIONS
-- ===========================================

CREATE TABLE public.tag_translations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_id BIGINT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    language content_language NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tag_id, language)
);

CREATE INDEX idx_tag_translations_tag ON public.tag_translations(tag_id);
CREATE INDEX idx_tag_translations_language ON public.tag_translations(language);

-- Trigger para updated_at
CREATE TRIGGER update_tag_translations_updated_at
    BEFORE UPDATE ON public.tag_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- MIGRATE EXISTING DATA TO PT-BR TRANSLATIONS
-- ===========================================

-- Migrar projetos existentes para tabela de traduções
INSERT INTO public.project_translations (project_id, language, title, subtitle, short_description, full_description, meta_description)
SELECT id, language, title, subtitle, short_description, full_description, meta_description
FROM public.projects;

-- Migrar artigos existentes para tabela de traduções
INSERT INTO public.article_translations (article_id, language, title, content, summary, excerpt, meta_description)
SELECT id, language, title, content, summary, excerpt, meta_description
FROM public.articles;

-- Migrar categorias existentes para tabela de traduções (assumir PT-BR)
INSERT INTO public.category_translations (category_id, language, name, description)
SELECT id, 'pt-BR', name, description
FROM public.categories;

-- Migrar tags existentes para tabela de traduções (assumir PT-BR)
INSERT INTO public.tag_translations (tag_id, language, name)
SELECT id, 'pt-BR', name
FROM public.tags;

-- ===========================================
-- RLS POLICIES FOR TRANSLATION TABLES
-- ===========================================

-- Project Translations
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project translations are viewable by everyone"
    ON public.project_translations FOR SELECT
    USING (true);

CREATE POLICY "Project translations are editable by authenticated users"
    ON public.project_translations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Project translations are updatable by authenticated users"
    ON public.project_translations FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Project translations are deletable by authenticated users"
    ON public.project_translations FOR DELETE
    TO authenticated
    USING (true);

-- Article Translations
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article translations are viewable by everyone"
    ON public.article_translations FOR SELECT
    USING (true);

CREATE POLICY "Article translations are editable by authenticated users"
    ON public.article_translations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Article translations are updatable by authenticated users"
    ON public.article_translations FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Article translations are deletable by authenticated users"
    ON public.article_translations FOR DELETE
    TO authenticated
    USING (true);

-- Category Translations
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category translations are viewable by everyone"
    ON public.category_translations FOR SELECT
    USING (true);

CREATE POLICY "Category translations are editable by authenticated users"
    ON public.category_translations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Category translations are updatable by authenticated users"
    ON public.category_translations FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Category translations are deletable by authenticated users"
    ON public.category_translations FOR DELETE
    TO authenticated
    USING (true);

-- Tag Translations
ALTER TABLE public.tag_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tag translations are viewable by everyone"
    ON public.tag_translations FOR SELECT
    USING (true);

CREATE POLICY "Tag translations are editable by authenticated users"
    ON public.tag_translations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Tag translations are updatable by authenticated users"
    ON public.tag_translations FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Tag translations are deletable by authenticated users"
    ON public.tag_translations FOR DELETE
    TO authenticated
    USING (true);
