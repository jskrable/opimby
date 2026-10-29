-- responded_by and author are the signed-in admin's email from the Access JWT.
ALTER TABLE volunteer_applications ADD COLUMN responded_at TEXT;
ALTER TABLE volunteer_applications ADD COLUMN responded_by TEXT;

ALTER TABLE donation_submissions ADD COLUMN responded_at TEXT;
ALTER TABLE donation_submissions ADD COLUMN responded_by TEXT;

CREATE TABLE submission_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('volunteer', 'donation')),
  submission_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX submission_notes_submission ON submission_notes (submission_type, submission_id, created_at);
