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
    <div className="min-h-screen bg-gradient-to-br from-[#84994F] to-[#FFE797]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            On-Page SEO Analysis Tool
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
           This tool analyzes on-page SEO issues for a specific URL and target keyword, and provides clear recommendations to fix the most critical problems.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-[#84994F]/30 rounded-lg focus:ring-2 focus:ring-[#84994F] focus:border-transparent bg-white text-slate-900 transition-all duration-200 hover:border-[#84994F]/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 mb-2">
                    Target Keyword
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="your target keyword"
                    className="w-full px-4 py-3 border border-[#84994F]/30 rounded-lg focus:ring-2 focus:ring-[#84994F] focus:border-transparent bg-white text-slate-900 transition-all duration-200 hover:border-[#84994F]/50"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#A72703]/10 border border-[#A72703]/30 text-[#A72703] px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#84994F] hover:bg-[#6a7a3f] disabled:bg-[#84994F]/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
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
                        color: 'bg-[#84994F]/10 text-[#84994F]',
                        badge: 'bg-[#84994F]',
                        label: 'Optimized',
                      },
                      average: {
                        color: 'bg-[#FCB53B]/10 text-[#FCB53B]',
                        badge: 'bg-[#FCB53B]',
                        label: 'Needs Improvement',
                      },
                      poor: {
                        color: 'bg-[#A72703]/10 text-[#A72703]',
                        badge: 'bg-[#A72703]',
                        label: 'Critical',
                      },
                    };
                    const config = sectionStatusConfig[sectionStatus];
                    return (
                      <div key={section.id} className={`border border-[#84994F]/20 rounded-2xl shadow-lg p-6 ${config.color} transition-all duration-200 hover:border-[#84994F]/40`}> 
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white text-xl ${config.badge}`}>{section.scorePercentage}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{section.label}</h3>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-[#84994F]/30 text-slate-700">{config.label}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-600">
                              {section.score}/{section.maxScore} points
                            </div>
                          </div>
                        </div>
                        {/* Rules List */}
                        <div className="space-y-3">
                          {section.rules.map((rule) => {
                            const ruleStatus = rule.status === 'pass' ? 'good' : 'poor';
                            const ruleConfig = ruleStatus === 'good'
                              ? { bg: 'bg-[#84994F]/5 border-[#84994F]/20', badge: 'bg-[#84994F]', label: 'PASS', text: 'text-[#84994F]' }
                              : { bg: 'bg-[#A72703]/5 border-[#A72703]/20', badge: 'bg-[#A72703]', label: 'FAIL', text: 'text-[#A72703]' };
                            return (
                              <div key={rule.id} className={`p-3 rounded-lg border ${ruleConfig.bg} transition-all duration-200 hover:border-[#84994F]/40`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${ruleConfig.badge}`}></div>
                                    <div>
                                      <span className="font-medium text-slate-900">{rule.label}</span>
                                      <p className="text-sm text-slate-600">{rule.explanation}</p>
                                      {rule.details && (
                                        <div className="mt-2 p-2 bg-slate-100 rounded text-xs text-slate-700">
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
                                                                ? <pre className="whitespace-pre-wrap bg-slate-200 rounded p-1 overflow-x-auto">{JSON.stringify(item, null, 2)}</pre>
                                                                : String(item)}
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      )
                                                    : (typeof value === 'object' && value !== null
                                                        ? <pre className="whitespace-pre-wrap bg-slate-200 rounded p-1 overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
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
                                    <p className="text-sm text-slate-600">
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
                <div className="bg-gradient-to-r from-[#84994F]/5 to-[#FFE797]/5 border border-[#84994F]/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analysis Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
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