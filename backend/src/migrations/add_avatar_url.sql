-- Add avatarUrl column to users table
ALTER TABLE users ADD COLUMN "avatarUrl" character varying;

-- Add comment to the column
COMMENT ON COLUMN users."avatarUrl" IS 'URL of the user avatar image'; 