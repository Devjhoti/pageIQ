-- Add analysis type tracking to queue
ALTER TABLE analysis_queue
ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general'
  CHECK (analysis_type IN ('general', 'comprehensive'));

-- Add analysis type and fb_token to reports
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'general'
  CHECK (analysis_type IN ('general', 'comprehensive'));

-- Store FB access token temporarily (cleared after use)
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fb_access_token text;

-- Store FB page ID when available
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fb_page_id text;
