CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  zip TEXT NOT NULL,
  service TEXT NOT NULL,
  photos TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);
