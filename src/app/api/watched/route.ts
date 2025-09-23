import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Movie interface
interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path?: string;
  backdrop_path?: string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  vote_count?: number;
}

// POST endpoint to save a movie to watched list
export async function POST(request: NextRequest) {
  try {
    const movie: Movie = await request.json();

    console.log("Attempting to save movie:", movie.title);

    if (!movie.id || !movie.title) {
      return NextResponse.json(
        { error: "Movie ID and title are required" },
        { status: 400 }
      );
    }

    // Prepare movie data for Supabase
    const movieData = {
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview || null,
      release_date: movie.release_date || null,
      vote_average: movie.vote_average || null,
      poster_path: movie.poster_path || null,
      backdrop_path: movie.backdrop_path || null,
      genre_ids: movie.genre_ids || null,
      adult: movie.adult || false,
      original_language: movie.original_language || null,
      original_title: movie.original_title || null,
      popularity: movie.popularity || null,
      video: movie.video || false,
      vote_count: movie.vote_count || null,
    };

    // Insert or update the movie using Supabase
    const { data, error } = await supabase
      .from("watched_movies")
      .upsert(movieData, {
        onConflict: "tmdb_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Movie saved to watched list",
      movie: data,
    });
  } catch (error) {
    console.error("Error saving movie to watched list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve watched movies
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("watched_movies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }

    console.log("GET watched movies - Found", data?.length || 0, "movies");
    console.log(
      "Movie IDs:",
      data?.map((m) => ({ id: m.tmdb_id, title: m.title }))
    );

    return NextResponse.json({
      success: true,
      movies: data,
    });
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a movie from watched list
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id") || searchParams.get("tmdb_id");

    console.log("DELETE request - movie id:", movieId);

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    // First, let's check if the movie exists
    const { data: existingMovie, error: checkError } = await supabase
      .from("watched_movies")
      .select("id, tmdb_id, title")
      .eq("id", parseInt(movieId))
      .single();

    console.log(
      "Checking for existing movie:",
      existingMovie,
      "Error:",
      checkError
    );

    if (checkError && checkError.code === "PGRST116") {
      return NextResponse.json(
        { error: "Movie not found in watched list" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("watched_movies")
      .delete()
      .eq("id", parseInt(movieId))
      .select()
      .single();

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Movie removed from watched list",
      movie: data,
    });
  } catch (error) {
    console.error("Error removing movie from watched list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
