-- Add category column to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS category TEXT; 