"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Globe, FileText, AlertCircle, Sparkles, Languages, Clock, User, Calendar, Zap, Brain, BookOpen } from "lucide-react";

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
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      position: 'relative',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              IntelliSummarize
            </h1>
            <div style={{
              padding: '0.5rem',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <Zap style={{ width: '1rem', height: '1rem', color: '#22c55e' }} />
            </div>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            AI-powered content extraction and multilingual translation for modern content creators
          </p>
        </div>

        {/* Main Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <Label htmlFor="url" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Blog URL
              </Label>
              <div style={{ position: 'relative', width: '100%' }}>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/blog-post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    height: '3.5rem',
                    fontSize: '1rem',
                    paddingLeft: '3.5rem',
                    paddingRight: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '1rem',
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Globe style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }} />
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !url.trim()}
              style={{
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                height: '3.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                background: isLoading || !url.trim() ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Zap style={{ width: '1.25rem', height: '1.25rem' }} />
                  Analyze & Extract
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert style={{
            marginBottom: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
            <AlertDescription style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '2rem'
          }}>
            {/* English Summary */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '0.75rem'
                  }}>
                    <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      AI Summary
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0
                    }}>
                      Intelligent content extraction
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Title</h4>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    lineHeight: '1.6',
                    margin: 0,
                    fontWeight: '500'
                  }}>{result.title}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Summary</h4>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    margin: 0
                  }}>{result.summary}</p>
                </div>
                
                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.author && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <User style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {result.author}
                      </span>
                    </div>
                  )}
                  {result.source && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Globe style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {result.source}
                      </span>
                    </div>
                  )}
                  {result.published && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Calendar style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {result.published}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Urdu Translation */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                    borderRadius: '0.75rem'
                  }}>
                    <Languages style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      Urdu Translation
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0
                    }}>
                      Multilingual content adaptation
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    textAlign: 'right',
                    direction: 'rtl',
                    margin: 0
                  }}>
                    {result.urduTranslation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        
        input:focus {
          outline: none !important;
          border-color: rgba(34, 197, 94, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1) !important;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3) !important;
        }
        
        div[style*="backdropFilter"]:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
}