-- Take down all relations first
-- page x visitor relations. This does not work.
DROP TABLE IF EXISTS page_visit;
DROP TABLE IF EXISTS page_comment;

-- take down the page
DROP TABLE IF EXISTS page CASCADE;

-- take down the visitor
DROP TABLE IF EXISTS visitor CASCADE;

-- take down the user table
DROP TABLE IF EXISTS "user" CASCADE;
-- take down the post table
DROP TABLE IF EXISTS post CASCADE;
