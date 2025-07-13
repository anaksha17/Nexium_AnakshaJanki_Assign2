"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe, FileText } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; urduTranslation: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Call our scraping API
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // For now, we'll create a simple summary from the scraped content
      // In the next step, we'll add AI summarization
      const content = data.content || '';
      const summary = content.length > 200 
        ? content.substring(0, 200) + '...' 
        : content;
      
      // Simple Urdu translation (we'll improve this later)
      const urduTranslation = "یہ مواد کا خلاصہ ہے۔ اگلے مرحلے میں، ہم بہتر ترجمہ شامل کریں گے۔";
      
      setResult({
        summary: `Title: ${data.title || 'No title'}\n\nSummary: ${summary}`,
        urduTranslation
      });
    } catch (error) {
      console.error("Error processing URL:", error);
      alert("Failed to scrape the URL. Please check the URL and try again.");
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
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                className="w-full"
              >
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
                <p className="text-slate-700 leading-relaxed">
                  {result.summary}
                </p>
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