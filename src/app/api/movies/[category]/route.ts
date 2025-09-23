import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDb API key not configured" },
        { status: 500 }
      );
    }

    // Map category to TMDb endpoint
    const categoryEndpoints: Record<string, string> = {
      popular: "popular",
      "top-rated": "top_rated",
      "now-playing": "now_playing",
      upcoming: "upcoming",
    };

    const endpoint = categoryEndpoints[category];
    if (!endpoint) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const tmdbUrl = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}&language=en-US&page=${page}`;

    const response = await fetch(tmdbUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "TMDb API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Movies API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
