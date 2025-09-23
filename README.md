# MovieTracker

A personal movie collection tracker built with Next.js, TypeScript, and Chakra UI. Search for movies, browse popular films, and manage your watched list.

## Features

- 🔍 **Search Movies**: Search for any movie using TMDb API
- 📺 **Browse Categories**: Explore Now Playing, Popular, Top Rated, and Upcoming movies
- ✅ **Watched List**: Save and manage movies you've watched
- 🎨 **Modern UI**: Clean, responsive design with Chakra UI
- 💾 **Persistent Storage**: Your watched list is saved to a PostgreSQL database

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Chakra UI v2
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **API**: The Movie Database (TMDb)
- **Styling**: Chakra UI with custom yellow theme and Outfit font

## Prerequisites

Before running the app, you'll need:

1. **Node.js** (version 18 or higher)
2. **TMDb API Key** - Get one free at [themoviedb.org](https://www.themoviedb.org/settings/api)
3. **Supabase Account** - For database storage (free tier available)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd accord-interview
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# TMDb API Key (required)
TMDB_API_KEY=your_tmdb_api_key_here

# Supabase Configuration (required for watched list)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the following SQL to create the watched movies table:

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watched_movies_tmdb_id ON watched_movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_watched_movies_created_at ON watched_movies(created_at);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Usage

1. **Home Page**: Search for movies and add them to your watched list
2. **Browse Movies**: Explore different movie categories (Now Playing, Popular, etc.)
3. **My Watched List**: View and manage your saved movies

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── search/        # Movie search endpoint
│   │   ├── watched/       # Watched movies CRUD
│   │   └── movies/        # Movie categories endpoint
│   ├── browse/            # Browse movies page
│   ├── watched/           # Watched list page
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── Navigation.tsx     # Top navigation
│   ├── SearchComponent.tsx # Movie search
│   ├── BrowseMovies.tsx   # Browse page
│   ├── WatchedMovies.tsx  # Watched list page
│   └── AppInitializer.tsx # App initialization
├── contexts/              # React contexts
│   └── MovieContext.tsx   # Global movie state
└── theme/                 # Chakra UI theme
    └── index.ts           # Custom theme configuration
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
