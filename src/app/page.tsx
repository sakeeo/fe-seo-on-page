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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 text-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#84994F]/10 text-[#84994F] font-bold">
              S
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-slate-900">
                SEE ON PAGE
              </span>
              <span className="block text-xs text-slate-500">
                On-page SEO free tool
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <a href="#tool" className="hover:text-slate-900 dark:hover:text-white">
              Tool
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">
              How it works
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {/* <button className="hidden md:inline-flex text-sm text-slate-600 hover:text-slate-900">
              Log in
            </button> */}
            <a
              href="#tool"
              className="inline-flex items-center justify-center rounded-full bg-[#FCB53B] px-4 py-2 text-sm font-semibold text-[#171717] shadow-sm hover:bg-[#e2a634] transition-colors"
            >
              Run free SEO check
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-16 text-foreground">
        {/* Hero + tool */}
        <section id="hero" className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFE797]/60 px-3 py-1 text-xs font-medium text-[#171717]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#84994F]">
                ●
              </span>
              100% free on-page SEO checker
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                See your on-page SEO health in seconds.
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                Enter a page URL and target keyword. We analyze your on-page SEO and surface clear, prioritized fixes you can act on today.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="inline-flex items-center justify-center rounded-full bg-[#FCB53B] px-5 py-2.5 text-sm font-semibold text-[#171717] shadow-sm hover:bg-[#e2a634] transition-colors"
                >
                  Run free SEO analysis
                </a>
                {/* <button
                  type="button"
                  className="text-sm font-medium text-[#84994F] hover:text-[#6a7a3f]"
                >
                  View sample report
                </button> */}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>• No credit card</span>
                <span>• Instant results</span>
                <span>• Focused on on-page SEO</span>
              </div>
            </div>
          </div>

          {/* Tool card */}
          <section
            id="tool"
            aria-label="On-page SEO analysis tool"
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 md:p-7 dark:bg-slate-900 dark:border-slate-800"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Run a free on-page SEO check
            </h2>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="url" className="block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Page URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your-page"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#84994F] focus:outline-none focus:ring-2 focus:ring-[#84994F]/40 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="keyword" className="block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Target keyword
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. best running shoes for women"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#84994F] focus:outline-none focus:ring-2 focus:ring-[#84994F]/40 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-[#A72703]/30 bg-[#A72703]/5 px-3 py-2 text-xs text-[#A72703] dark:border-[#fecaca]/40 dark:bg-[#7f1d1d]/40 dark:text-[#fecaca]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#84994F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6a7a3f] disabled:cursor-not-allowed disabled:bg-[#84994F]/60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analyzing…
                  </div>
                ) : (
                  'Analyze SEO'
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                We only use your URL to run this analysis. No crawling beyond the page you provide.
              </p>
            </form>
          </section>
        </section>

        {/* Results Section - score full-width, details below */}
        {result && (
          <section
            aria-label="SEO analysis report"
            className="space-y-6"
          >
            <SEOScoreCard
              score={result.scorePercentage}
              date={new Date().toISOString().slice(0, 10)}
              keyword={result.keyword}
              url={result.url}
            />

            {/* Sections Overview */}
            <div className="grid gap-5 lg:grid-cols-2">
              {result.sections.map((section) => {
                const sectionStatus = section.scorePercentage >= 80 ? 'good' : section.scorePercentage >= 60 ? 'average' : 'poor';
                const sectionStatusConfig = {
                  good: {
                    color: 'bg-[#84994F]/5 text-[#84994F]',
                    badge: 'bg-[#84994F]',
                    label: 'Optimized',
                  },
                  average: {
                    color: 'bg-[#FCB53B]/5 text-[#FCB53B]',
                    badge: 'bg-[#FCB53B]',
                    label: 'Needs improvement',
                  },
                  poor: {
                    color: 'bg-[#A72703]/5 text-[#A72703]',
                    badge: 'bg-[#A72703]',
                    label: 'Critical',
                  },
                } as const;
                const config = sectionStatusConfig[sectionStatus];
                return (
                  <div
                    key={section.id}
                    className={`border border-slate-200 rounded-xl bg-white p-4 text-sm ${config.color}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white text-xl ${config.badge}`}>{section.scorePercentage}</div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{section.label}</h3>
                          <span className="mt-1 inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F5F5F7] border border-slate-200 text-slate-700">
                            {config.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {section.score}/{section.maxScore} points
                        </div>
                      </div>
                    </div>
                    {/* Rules List */}
                    <div className="space-y-2">
                      {section.rules.map((rule) => {
                        const ruleStatus = rule.status === 'pass' ? 'good' : 'poor';
                        const ruleConfig = ruleStatus === 'good'
                          ? { bg: 'bg-[#84994F]/5 border-[#84994F]/20', badge: 'bg-[#84994F]', label: 'PASS', text: 'text-[#84994F]' }
                          : { bg: 'bg-[#A72703]/5 border-[#A72703]/20', badge: 'bg-[#A72703]', label: 'ISSUE', text: 'text-[#A72703]' };
                        return (
                          <div
                            key={rule.id}
                            className={`p-3 rounded-lg border ${ruleConfig.bg}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${ruleConfig.badge}`}></div>
                                <div>
                                  <span className="font-medium text-slate-900 text-sm">{rule.label}</span>
                                  <p className="text-xs text-slate-600 mt-0.5">{rule.explanation}</p>
                                  {rule.details && (
                                    <div className="mt-2 p-2 bg-slate-100 rounded text-[11px] text-slate-700">
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
                                <span className={`text-xs font-semibold ${ruleConfig.text}`}>{ruleConfig.label}</span>
                                <p className="text-xs text-slate-600 mt-1">
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
          </section>
        )}

        {/* How it works */}
        <section id="how-it-works" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">How See On Page works</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              We run a focused, on-page SEO review for the URL and keyword you provide, then group findings into clear sections so you know exactly what to fix.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-semibold text-[#84994F]">Step 1</span>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">Enter your URL & keyword</h3>
              <p className="mt-1 text-xs text-slate-600">
                Paste the page you want to check and the main keyword you want to rank for.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-semibold text-[#84994F]">Step 2</span>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">We run the analysis</h3>
              <p className="mt-1 text-xs text-slate-600">
                Our engine checks titles, headings, content, links, and technical on-page factors.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-semibold text-[#84994F]">Step 3</span>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">Get a prioritized checklist</h3>
              <p className="mt-1 text-xs text-slate-600">
                See your score and a list of issues, grouped by impact, with clear context.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-6 pb-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Frequently asked questions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              A few quick answers about how the free on-page SEO tool works.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900">
                Is this tool really free?
                <span className="text-xs text-slate-500 group-open:hidden">+</span>
                <span className="text-xs text-slate-500 hidden group-open:inline">−</span>
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                Yes. You can run on-page SEO checks without creating an account or adding a credit card.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900">
                Do you store my URLs or data?
                <span className="text-xs text-slate-500 group-open:hidden">+</span>
                <span className="text-xs text-slate-500 hidden group-open:inline">−</span>
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                We only use the URL and keyword you provide to run the analysis. You can clear results at any time by refreshing the page.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900">
                What does the SEO score mean?
                <span className="text-xs text-slate-500 group-open:hidden">+</span>
                <span className="text-xs text-slate-500 hidden group-open:inline">−</span>
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                The score summarizes how well your page follows our on-page SEO checks for the keyword you entered. Use it as a guide to prioritize fixes, not as a guarantee of rankings.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-4 px-4 md:hidden">
        <a
          href="#tool"
          className="inline-flex w-full max-w-md mx-auto items-center justify-center rounded-full bg-[#FCB53B] px-5 py-3 text-sm font-semibold text-[#171717] shadow-md hover:bg-[#e2a634] transition-colors"
        >
          Run free SEO check
        </a>
      </div>
    </div>
  );
}