CREATE TABLE volunteer_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT NOT NULL DEFAULT '[]', -- JSON array
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX volunteer_applications_created_at ON volunteer_applications (created_at);

CREATE TABLE donation_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  items TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('outreach', 'pickup')),
  area TEXT, -- neighborhood or ZIP only, never a street address
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX donation_submissions_created_at ON donation_submissions (created_at);
