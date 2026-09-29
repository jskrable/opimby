CREATE TABLE volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT NOT NULL DEFAULT '[]', -- JSON array
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX volunteers_created_at ON volunteers (created_at);
