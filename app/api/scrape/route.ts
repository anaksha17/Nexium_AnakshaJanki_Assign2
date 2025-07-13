import { NextRequest, NextResponse } from "next/server";
import { extract } from "@extractus/article-extractor";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const article = await extract(url);

    if (!article || !article.content) {
      return NextResponse.json({ error: "Could not extract article content" }, { status: 422 });
    }

    return NextResponse.json({
      title: article.title,
      content: article.content,
      author: article.author,
      source: article.source,
      published: article.published,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to scrape article", details: (error as Error).message }, { status: 500 });
  }
}