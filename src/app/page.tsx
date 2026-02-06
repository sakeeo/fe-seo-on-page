'use client';
import { useState } from 'react';

interface SEORule {
  id: string;
  label: string;
  type: string;
  passed: boolean;
  score: number;
  maxScore: number;
  status: string;
  explanation: string;
  details: any;
}

interface SEOSection {
  id: string;
  label: string;
  scorePercentage: number;
  score: number;
  maxScore: number;
  rules: SEORule[];
}

interface SEOAnalysis {
  success: boolean;
  url: string;
  keyword: string;
  httpStatus: number;
  scorePercentage: number;
  totalScore: number;
  totalMaxScore: number;
  sections: SEOSection[];
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SEOAnalysis | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    if (!keyword.trim()) {
      setError('Please enter a keyword to analyze');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://api-seo-on-page.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          keyword: keyword.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError('Failed to analyze website. Please try again.');
      }
    } catch (err) {
      setError('Failed to analyze website. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen pt-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            On-Page SEO Analysis Tool
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
           This tool analyzes on-page SEO issues for a specific URL and target keyword, and provides clear recommendations to fix the most critical problems.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Keyword
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="your target keyword"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze SEO'
                  )}
                </button>
              </div>
            </form>

            {/* Results Section */}
            {result && (
              <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                
                {/* SEO Score */}
                <div className={`p-6 rounded-xl ${getScoreBg(result.scorePercentage)} border border-slate-200 dark:border-slate-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SEO Score</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Overall optimization level</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(result.scorePercentage)}`}>
                        {result.scorePercentage}/100
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Total Score: {result.totalScore}/{result.totalMaxScore}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections Overview */}
                <div className="grid gap-6">
                  {result.sections.map((section) => (
                    <div key={section.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.label}</h3>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(section.scorePercentage)}`}>
                            {section.scorePercentage}%
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {section.score}/{section.maxScore} points
                          </div>
                        </div>
                      </div>
                      
                      {/* Rules List */}
                      <div className="space-y-3">
                        {section.rules.map((rule) => (
                          <div key={rule.id} className={`p-3 rounded-lg border ${
                            rule.status === 'pass' 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  rule.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white">{rule.label}</span>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{rule.explanation}</p>
                                  {rule.details && (
                                    <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                                      <strong>Details:</strong> {JSON.stringify(rule.details)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-sm font-medium ${
                                  rule.status === 'pass' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {rule.status === 'pass' ? 'PASS' : 'FAIL'}
                                </span>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {rule.score}/{rule.maxScore} points
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analysis Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="font-medium">Analyzed URL:</span> {result.url}
                    </div>
                    <div>
                      <span className="font-medium">Target Keyword:</span> {result.keyword}
                    </div>
                    <div>
                      <span className="font-medium">HTTP Status:</span> {result.httpStatus}
                    </div>
                    <div>
                      <span className="font-medium">Total Score:</span> {result.totalScore}/{result.totalMaxScore}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}