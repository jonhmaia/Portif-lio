-- Portfolio & Blog Seed Data
-- Migration 004: Initial Data (Optional)

-- ===========================================
-- SEED TECHNOLOGIES
-- ===========================================

INSERT INTO public.technologies (name, slug, icon_class, color_hex, category, is_active)
VALUES
    -- Languages
    ('JavaScript', 'javascript', 'devicon-javascript-plain', '#F7DF1E', 'language', true),
    ('TypeScript', 'typescript', 'devicon-typescript-plain', '#3178C6', 'language', true),
    ('Python', 'python', 'devicon-python-plain', '#3776AB', 'language', true),
    ('HTML5', 'html5', 'devicon-html5-plain', '#E34F26', 'language', true),
    ('CSS3', 'css3', 'devicon-css3-plain', '#1572B6', 'language', true),
    
    -- Frameworks
    ('React', 'react', 'devicon-react-original', '#61DAFB', 'framework', true),
    ('Next.js', 'nextjs', 'devicon-nextjs-original', '#000000', 'framework', true),
    ('Node.js', 'nodejs', 'devicon-nodejs-plain', '#339933', 'framework', true),
    ('Django', 'django', 'devicon-django-plain', '#092E20', 'framework', true),
    ('Express', 'express', 'devicon-express-original', '#000000', 'framework', true),
    ('Tailwind CSS', 'tailwindcss', 'devicon-tailwindcss-plain', '#06B6D4', 'framework', true),
    
    -- Libraries
    ('React Query', 'react-query', NULL, '#FF4154', 'lib', true),
    ('Zustand', 'zustand', NULL, '#433D3C', 'lib', true),
    ('Prisma', 'prisma', 'devicon-prisma-original', '#2D3748', 'lib', true),
    
    -- Databases
    ('PostgreSQL', 'postgresql', 'devicon-postgresql-plain', '#4169E1', 'db', true),
    ('MongoDB', 'mongodb', 'devicon-mongodb-plain', '#47A248', 'db', true),
    ('Redis', 'redis', 'devicon-redis-plain', '#DC382D', 'db', true),
    ('Supabase', 'supabase', 'devicon-supabase-plain', '#3ECF8E', 'db', true),
    
    -- Tools
    ('Git', 'git', 'devicon-git-plain', '#F05032', 'tool', true),
    ('Docker', 'docker', 'devicon-docker-plain', '#2496ED', 'tool', true),
    ('VS Code', 'vscode', 'devicon-vscode-plain', '#007ACC', 'tool', true),
    ('Figma', 'figma', 'devicon-figma-plain', '#F24E1E', 'tool', true),
    ('Vercel', 'vercel', 'devicon-vercel-plain', '#000000', 'tool', true)
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- SEED CATEGORIES
-- ===========================================

INSERT INTO public.categories (name, slug, description, color_hex, display_order)
VALUES
    ('Tutoriais', 'tutoriais', 'Guias passo a passo e tutoriais práticos', '#10B981', 1),
    ('Dicas', 'dicas', 'Dicas rápidas e truques de programação', '#F59E0B', 2),
    ('Carreira', 'carreira', 'Conteúdo sobre carreira em tecnologia', '#8B5CF6', 3),
    ('Projetos', 'projetos', 'Artigos sobre projetos e desenvolvimento', '#3B82F6', 4),
    ('Opinião', 'opiniao', 'Reflexões e opiniões sobre tecnologia', '#EF4444', 5)
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- SEED TAGS
-- ===========================================

INSERT INTO public.tags (name, slug, color_hex)
VALUES
    ('React', 'react', '#61DAFB'),
    ('Next.js', 'nextjs', '#000000'),
    ('TypeScript', 'typescript', '#3178C6'),
    ('JavaScript', 'javascript', '#F7DF1E'),
    ('Node.js', 'nodejs', '#339933'),
    ('Python', 'python', '#3776AB'),
    ('CSS', 'css', '#1572B6'),
    ('Tailwind', 'tailwind', '#06B6D4'),
    ('Supabase', 'supabase', '#3ECF8E'),
    ('PostgreSQL', 'postgresql', '#4169E1'),
    ('API', 'api', '#FF6B6B'),
    ('Frontend', 'frontend', '#4ECDC4'),
    ('Backend', 'backend', '#95E1D3'),
    ('DevOps', 'devops', '#F38181'),
    ('Performance', 'performance', '#AA96DA'),
    ('Segurança', 'seguranca', '#FF6F91'),
    ('Testes', 'testes', '#67D5B5'),
    ('Git', 'git', '#F05032'),
    ('Docker', 'docker', '#2496ED'),
    ('Deploy', 'deploy', '#845EC2')
ON CONFLICT (name) DO NOTHING;
