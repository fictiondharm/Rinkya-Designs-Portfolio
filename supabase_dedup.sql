-- Remove duplicate projects (keeps only one per title + world)
-- Run this in Supabase SQL Editor if you see duplicate entries
DELETE FROM projects
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY title, world
      ORDER BY sort_order, created_at
    ) as rn
    FROM projects
  ) t
  WHERE t.rn > 1
);
