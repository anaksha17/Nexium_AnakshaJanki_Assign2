"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Globe, FileText, AlertCircle } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    summary: string;
    urduTranslation: string;
    author?: string;
    source?: string;
    published?: string;
  } | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setResult({
        title: data.title || "No title",
        summary: data.summary || "No summary available",
        urduTranslation: data.urduTranslation || "No translation available",
        author: data.author,
        source: data.source,
        published: data.published,
      });
    } catch (error) {
      console.error("Error processing URL:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Blog Scraper & Summarizer
          </h1>
          <p className="text-slate-600 text-lg">
            Extract, summarize, and translate blog content with AI
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Enter Blog URL
            </CardTitle>
            <CardDescription>
              Paste any blog URL below to extract and summarize its content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Blog URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/blog-post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading || !url.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Extract & Summarize
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* English Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  AI Summary
                </CardTitle>
                <CardDescription>
                  Generated summary of the blog content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong className="text-slate-900">Title:</strong>
                    <p className="text-slate-700 mt-1">{result.title}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900">Summary:</strong>
                    <p className="text-slate-700 mt-1 leading-relaxed">{result.summary}</p>
                  </div>
                  {result.author && (
                    <div>
                      <strong className="text-slate-900">Author:</strong>
                      <p className="text-slate-700 mt-1">{result.author}</p>
                    </div>
                  )}
                  {result.source && (
                    <div>
                      <strong className="text-slate-900">Source:</strong>
                      <p className="text-slate-700 mt-1">{result.source}</p>
                    </div>
                  )}
                  {result.published && (
                    <div>
                      <strong className="text-slate-900">Published:</strong>
                      <p className="text-slate-700 mt-1">{result.published}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Urdu Translation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Urdu Translation
                </CardTitle>
                <CardDescription>
                  Summary translated to Urdu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed text-right" dir="rtl">
                  {result.urduTranslation}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}