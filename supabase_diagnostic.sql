-- DIAGNOSTIC: Check if RLS is actually off
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'projects';

-- Check if functions exist
SELECT proname, prosrc FROM pg_proc WHERE proname IN ('insert_project', 'update_project');

-- Check who can execute the function
SELECT n.nspname as schema, p.proname as function, 
       pg_catalog.pg_get_functiondef(p.oid) as def
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'insert_project';
