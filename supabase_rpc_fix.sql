-- Simplified RPC functions that bypass RLS

-- Drop old versions first
DROP FUNCTION IF EXISTS public.insert_project;
DROP FUNCTION IF EXISTS public.update_project;

-- Simple insert function
CREATE OR REPLACE FUNCTION public.insert_project(
  p_title text,
  p_description text,
  p_world text,
  p_tags text[],
  p_image_url text,
  p_video_url text,
  p_featured boolean
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.projects (title, description, world, tags, image_url, video_url, featured)
  VALUES (p_title, p_description, p_world, 
          COALESCE(p_tags, ARRAY[]::text[]), 
          NULLIF(p_image_url, ''), 
          NULLIF(p_video_url, ''), 
          COALESCE(p_featured, false));
END;
$$;

-- Simple update function
CREATE OR REPLACE FUNCTION public.update_project(
  p_id uuid,
  p_title text,
  p_description text,
  p_world text,
  p_tags text[],
  p_image_url text,
  p_video_url text,
  p_featured boolean
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.projects SET
    title = p_title,
    description = p_description,
    world = p_world,
    tags = COALESCE(p_tags, ARRAY[]::text[]),
    image_url = NULLIF(p_image_url, ''),
    video_url = NULLIF(p_video_url, ''),
    featured = COALESCE(p_featured, false)
  WHERE id = p_id;
END;
$$;

-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION public.insert_project TO public;
GRANT EXECUTE ON FUNCTION public.update_project TO public;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
