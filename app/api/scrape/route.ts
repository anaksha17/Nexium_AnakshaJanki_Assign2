import { NextRequest, NextResponse } from "next/server";
import { extract } from "@extractus/article-extractor";
import { createClient } from "@supabase/supabase-js";
import { MongoClient } from "mongodb";
import { convert } from "html-to-text";

// Urdu dictionary for translation
const urduDictionary: { [key: string]: string } = {
  summary: "خلاصہ",
  article: "مضمون",
  content: "مواد",
  read: "پڑھیں",
  more: "مزید",
  blog: "بلاگ",
  information: "معلومات",
  technology: "ٹیکنالوجی",
  learn: "سیکھیں",
  about: "کے بارے میں",
  the: "یہ",
  and: "اور",
  is: "ہے",
  are: "ہیں",
  this: "یہ",
  that: "وہ",
  with: "کے ساتھ",
  for: "کے لیے",
  from: "سے",
  to: "کو",
  in: "میں",
  on: "پر",
  at: "میں",
  by: "کے ذریعے",
  of: "کا",
  can: "کر سکتے ہیں",
  will: "کریں گے",
  have: "ہے",
  has: "ہے",
  was: "تھا",
  were: "تھے",
  been: "گیا",
  being: "جا رہا",
  do: "کرتے ہیں",
  does: "کرتا ہے",
  did: "کیا",
  done: "کیا گیا",
  make: "بنانا",
  makes: "بناتا ہے",
  made: "بنایا",
  get: "حاصل کرنا",
  gets: "حاصل کرتا ہے",
  got: "حاصل کیا",
  take: "لینا",
  takes: "لیتا ہے",
  took: "لیا",
  give: "دینا",
  gives: "دیتا ہے",
  gave: "دیا",
  go: "جانا",
  goes: "جاتا ہے",
  went: "گیا",
  come: "آنا",
  comes: "آتا ہے",
  came: "آیا",
  see: "دیکھنا",
  sees: "دیکھتا ہے",
  saw: "دیکھا",
  know: "جاننا",
  knows: "جانتا ہے",
  knew: "جانتا تھا",
  think: "سوچنا",
  thinks: "سوچتا ہے",
  thought: "سوچا",
  work: "کام",
  works: "کام کرتا ہے",
  worked: "کام کیا",
  time: "وقت",
  way: "طریقہ",
  people: "لوگ",
  world: "دنیا",
  life: "زندگی",
  day: "دن",
  year: "سال",
  new: "نیا",
  good: "اچھا",
  great: "عظیم",
  best: "بہترین",
  first: "پہلا",
  last: "آخری",
  long: "لمبا",
  little: "چھوٹا",
  own: "اپنا",
  other: "دوسرا",
  right: "صحیح",
  big: "بڑا",
  high: "اونچا",
  different: "مختلف",
  small: "چھوٹا",
  large: "بڑا",
  next: "اگلا",
  early: "جلدی",
  young: "نوجوان",
  important: "اہم",
  few: "کچھ",
  public: "عوامی",
  bad: "برا",
  same: "ویسا ہی",
  able: "قابل",
};

// Simple static summarization
function summarizeContent(content: string): string {
  const text = convert(content, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  let wordCount = 0;
  const selectedSentences: string[] = [];
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/).length;
    if (wordCount + words <= 150 && selectedSentences.length < 3) {
      selectedSentences.push(sentence.trim());
      wordCount += words;
    } else {
      break;
    }
  }
  return selectedSentences.join(". ") + (selectedSentences.length > 0 ? "." : "");
}

// Simple Urdu translation
function translateToUrdu(text: string): string {
  let translated = text;
  for (const [en, ur] of Object.entries(urduDictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, ur);
  }
  return translated;
}

export async function POST(req: NextRequest) {
  // Environment variables validation
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const mongoUri = process.env.MONGODB_URI;

  console.log("Environment check:");
  console.log("SUPABASE_URL:", supabaseUrl ? "✓ Found" : "✗ Missing");
  console.log("SUPABASE_ANON_KEY:", supabaseKey ? "✓ Found" : "✗ Missing");
  console.log("MONGODB_URI:", mongoUri ? "✓ Found" : "✗ Missing");

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase configuration is missing (URL or key not found)" },
      { status: 500 }
    );
  }

  if (!mongoUri) {
    return NextResponse.json(
      { error: "MongoDB URI is missing" },
      { status: 500 }
    );
  }

  let mongoClient: MongoClient | null = null;

  try {
    // Parse and validate request body
    const body = await req.json();
    const { url } = body;
    
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }

    console.log("Processing URL:", url);

    // Extract article content
    const article = await extract(url);
    console.log("Article extracted:", article ? "✓ Success" : "✗ Failed");
    
    if (!article || !article.content) {
      return NextResponse.json({ error: "Could not extract article content" }, { status: 422 });
    }

    // Generate summary and translation
    const summary = summarizeContent(article.content);
    const urduTranslation = translateToUrdu(summary);

    console.log("Summary generated:", summary ? "✓ Success" : "✗ Failed");
    console.log("Urdu translation:", urduTranslation ? "✓ Success" : "✗ Failed");

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to Supabase
    const { error: supabaseError } = await supabase
      .from("summaries")
      .insert({
        url,
        title: article.title || "No title",
        summary,
        urdu_translation: urduTranslation,
        created_at: new Date().toISOString(),
      });

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to save summary to Supabase", details: supabaseError.message },
        { status: 500 }
      );
    }

    console.log("Saved to Supabase: ✓ Success");

    // Connect to MongoDB and save full article
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    
    const db = mongoClient.db("blog_scraper");
    const articlesCollection = db.collection("articles");

    await articlesCollection.insertOne({
      url,
      title: article.title || "No title",
      content: article.content,
      author: article.author || null,
      source: article.source || null,
      published: article.published || null,
      created_at: new Date(),
    });

    console.log("Saved to MongoDB: ✓ Success");

    // Return successful response
    return NextResponse.json({
      title: article.title || "No title",
      summary,
      urduTranslation,
      author: article.author || null,
      source: article.source || null,
      published: article.published || null,
    });

  } catch (error) {
    console.error("Error processing article:", error);
    return NextResponse.json(
      { 
        error: "Failed to process article", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    // Always close MongoDB connection
    if (mongoClient) {
      try {
        await mongoClient.close();
        console.log("MongoDB connection closed");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
}