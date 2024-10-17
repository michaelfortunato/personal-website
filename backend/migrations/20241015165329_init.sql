CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(120) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL
);

CREATE TYPE PROVIDER AS ENUM (
  'github'
);

CREATE TABLE "account" (
  -- id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL
  provider PROVIDER NOT NULL,
  PRIMARY KEY (user_id, provider)
);

CREATE TABLE "post" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(150),
  tags TEXT[],
  content TEXT,
  UNIQUE (author_id, title)
);


CREATE TABLE "comment" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
  post_id UUID REFERENCES "post"(id) ON DELETE CASCADE,
  content TEXT
);


