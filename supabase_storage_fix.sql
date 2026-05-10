-- 1. Ensure works bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('works', 'works', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop any existing policies on storage.objects for works bucket
DROP POLICY IF EXISTS "works_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "works_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "works_delete_policy" ON storage.objects;

-- 3. Allow public uploads to works bucket (bypasses RLS)
CREATE POLICY "works_upload_policy" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'works');

CREATE POLICY "works_read_policy" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'works');

CREATE POLICY "works_delete_policy" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'works');

-- 4. Also disable RLS as a safety net
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
