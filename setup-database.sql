-- Create watched_movies table in Supabase
CREATE TABLE IF NOT EXISTS watched_movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  overview TEXT,
  release_date DATE,
  vote_average DECIMAL(3,1),
  poster_path VARCHAR(500),
  backdrop_path VARCHAR(500),
  genre_ids INTEGER[],
  adult BOOLEAN DEFAULT FALSE,
  original_language VARCHAR(10),
  original_title VARCHAR(255),
  popularity DECIMAL(10,3),
  video BOOLEAN DEFAULT FALSE,
  vote_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on tmdb_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_watched_movies_tmdb_id ON watched_movies(tmdb_id);

-- Create an index on created_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_watched_movies_created_at ON watched_movies(created_at);
