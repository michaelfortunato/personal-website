-- Most important table so far
CREATE TABLE IF NOT EXISTS page (
url VARCHAR(100),
created_at TIMESTAMP,
modified_at TIMESTAMP,
PRIMARY KEY (url)
);

-- Visitor table so far
CREATE TABLE IF NOT EXISTS visitor (
ip inet,
PRIMARY KEY (ip)
);

-- Page:Visitor table 
CREATE TABLE IF NOT EXISTS page_visit (
page_url VARCHAR(100) REFERENCES page(url) ON DELETE CASCADE ON UPDATE CASCADE,
visitor_ip inet REFERENCES visitor(ip) ON DELETE CASCADE ON UPDATE CASCADE,
first_visited TIMESTAMP,
last_visited TIMESTAMP,
number_of_visits integer,
reaction integer,
PRIMARY KEY (page_url, visitor_ip));

CREATE TABLE IF NOT EXISTS page_comment (
id integer GENERATED ALWAYS AS IDENTITY,
page_url VARCHAR(100) REFERENCES page(url) ON DELETE CASCADE ON UPDATE CASCADE,
visitor_ip inet REFERENCES visitor(ip) ON DELETE CASCADE ON UPDATE CASCADE,
content VARCHAR(1000));

CREATE TABLE IF NOT EXISTS "user" (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username VARCHAR(200) UNIQUE,
email VARCHAR(200) UNIQUE
);

-- Add the root user, me!
INSERT INTO "user" (id, username, email) OVERRIDING SYSTEM VALUE
VALUES (0, 'michaelfortunato', 'michael.n.fortunato@gmail.com')
ON CONFLICT DO NOTHING
;

CREATE TABLE IF NOT EXISTS post (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
author_id integer REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
title VARCHAR(150),
tags text[],
content text,
UNIQUE(author_id, title)
);
