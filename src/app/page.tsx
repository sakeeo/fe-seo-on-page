'use client';
import { useState } from 'react';
import SEOScoreCard from '../components/SEOScoreCard';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/analyze';
      const response = await fetch(apiUrl, {
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
  <SEOScoreCard 
    score={result.scorePercentage}
    date={new Date().toISOString().slice(0, 10)}
    keyword={result.keyword}
    url={result.url}
  />
    

                {/* Sections Overview */}
                <div className="grid gap-6">
                  {result.sections.map((section) => {
                    const sectionStatus = section.scorePercentage >= 80 ? 'good' : section.scorePercentage >= 60 ? 'average' : 'poor';
                    const sectionStatusConfig = {
                      good: {
                        color: 'bg-green-100 text-green-700',
                        badge: 'bg-green-500',
                        label: 'Optimized',
                      },
                      average: {
                        color: 'bg-yellow-100 text-yellow-700',
                        badge: 'bg-yellow-500',
                        label: 'Needs Improvement',
                      },
                      poor: {
                        color: 'bg-red-100 text-red-700',
                        badge: 'bg-red-500',
                        label: 'Critical',
                      },
                    };
                    const config = sectionStatusConfig[sectionStatus];
                    return (
                      <div key={section.id} className={`border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 ${config.color} dark:bg-slate-800`}> 
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white text-xl ${config.badge}`}>{section.scorePercentage}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.label}</h3>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 ml-1">{config.label}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {section.score}/{section.maxScore} points
                            </div>
                          </div>
                        </div>
                        {/* Rules List */}
                        <div className="space-y-3">
                          {section.rules.map((rule) => {
                            const ruleStatus = rule.status === 'pass' ? 'good' : 'poor';
                            const ruleConfig = ruleStatus === 'good'
                              ? { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', badge: 'bg-green-500', label: 'PASS', text: 'text-green-600' }
                              : { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', badge: 'bg-red-500', label: 'FAIL', text: 'text-red-600' };
                            return (
                              <div key={rule.id} className={`p-3 rounded-lg border ${ruleConfig.bg}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${ruleConfig.badge}`}></div>
                                    <div>
                                      <span className="font-medium text-slate-900 dark:text-white">{rule.label}</span>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">{rule.explanation}</p>
                                      {rule.details && (
                                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                                          <strong>Details:</strong>
                                          {typeof rule.details === 'object' && rule.details !== null ? (
                                            <ul className="list-disc pl-5 mt-1">
                                              {Object.entries(rule.details).map(([key, value]) => (
                                                <li key={key} className="break-all">
                                                  <span className="font-semibold">{key}:</span> {Array.isArray(value)
                                                    ? (
                                                        <ul className="list-decimal pl-5 mt-1">
                                                          {value.map((item, idx) => (
                                                            <li key={idx} className="break-all">
                                                              {typeof item === 'object' && item !== null
                                                                ? <pre className="whitespace-pre-wrap bg-slate-200 dark:bg-slate-800 rounded p-1 overflow-x-auto">{JSON.stringify(item, null, 2)}</pre>
                                                                : String(item)}
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      )
                                                    : (typeof value === 'object' && value !== null
                                                        ? <pre className="whitespace-pre-wrap bg-slate-200 dark:bg-slate-800 rounded p-1 overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                                                        : String(value)
                                                    )}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <span className="ml-1">{String(rule.details)}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-sm font-medium ${ruleConfig.text}`}>{ruleConfig.label}</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      {rule.score}/{rule.maxScore} points
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
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