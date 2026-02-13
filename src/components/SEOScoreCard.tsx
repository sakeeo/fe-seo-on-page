'use client';

interface SEOScoreCardProps {
  score: number;          // 0–100
  date: string;           // yyyy-mm-dd
  keyword: string;
  url: string;
}

export default function SEOScoreCard({
  score,
  date,
  keyword,
  url,
}: SEOScoreCardProps) {
  const status =
    score >= 80 ? 'good' : score >= 60 ? 'average' : 'poor';

  const getStatusConfig = () => {
    switch (status) {
      case 'good':
        return {
          color: 'text-[#84994F]',
          bg: 'bg-[#84994F]/5',
          border: 'border-[#84994F]/20',
          gradient: 'from-[#84994F] via-[#6a7a3f] to-[#4d5a2f]',
          shadow: 'shadow-[#84994F]/20'
        };
      case 'average':
        return {
          color: 'text-[#FCB53B]',
          bg: 'bg-[#FCB53B]/5',
          border: 'border-[#FCB53B]/20',
          gradient: 'from-[#FCB53B] via-[#d99a2b] to-[#b67f22]',
          shadow: 'shadow-[#FCB53B]/20'
        };
      case 'poor':
        return {
          color: 'text-[#A72703]',
          bg: 'bg-[#A72703]/5',
          border: 'border-[#A72703]/20',
          gradient: 'from-[#A72703] via-[#861f02] to-[#651702]',
          shadow: 'shadow-[#A72703]/20'
        };
      default:
        return {
          color: 'text-slate-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          gradient: 'from-slate-400 via-slate-500 to-slate-600',
          shadow: 'shadow-slate-500/20'
        };
    }
  };

  const config = getStatusConfig();
  
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`
      bg-gradient-to-br ${config.bg}
      border ${config.border}
      rounded-2xl px-8 py-8 text-center
      shadow-md ${config.shadow}
      hover:shadow-lg transition-all duration-300
      group
      relative overflow-hidden
    `}>
      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-3 relative z-10 text-slate-900 dark:text-slate-50">
        Your score is{' '}
        <span className={`${config.color} font-extrabold tracking-tight`}>
          {status}
        </span>
      </h2>

      {/* STATUS BADGE */}
      <div className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        bg-white/10 backdrop-blur-sm border ${config.border}
        mb-4 relative z-10
      `}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}></div>
        <span className="text-slate-700 dark:text-slate-200">SEO Performance</span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed relative z-10">
        We’ve successfully processed your page and calculated a score
        representing how closely this page follows the current guidelines
        for on-page SEO.
      </p>

      {/* SCORE */}
      <div className="flex justify-center my-8 relative z-10">
        <div className="relative">
          <svg width="160" height="160" className="transform group-hover:scale-105 transition-transform duration-300">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
              fill="none"
              className="drop-shadow-lg"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={`url(#gradient-${status})`}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px rgba(${status === 'good' ? '132, 153, 79' : status === 'average' ? '252, 181, 59' : '167, 39, 3'}, 0.4))`
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id={`gradient-${status}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={status === 'good' ? '#84994F' : status === 'average' ? '#FCB53B' : '#A72703'} />
                <stop offset="100%" stopColor={status === 'good' ? '#6a7a3f' : status === 'average' ? '#d99a2b' : '#861f02'} />
              </linearGradient>
            </defs>
            {/* Score text */}
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="fill-white text-4xl font-extrabold drop-shadow-2xl"
            >
              {score}
            </text>
          </svg>
          {/* Score label */}
          <div className="p-4 absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 font-medium">
            <div style={{ marginTop: '2.5rem' }} className="relative text-xs text-slate-400 font-medium">
              out of 100
            </div>
          </div>
        </div>
      </div>

      {/* META */}
      <div className="flex justify-center gap-4 md:gap-8 text-sm text-slate-700 dark:text-slate-300 flex-wrap relative z-10">
        <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
          <span className="text-slate-500 dark:text-slate-300">📅</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
          <span className="text-slate-500 dark:text-slate-300">🔑</span>
          <span className="font-medium">{keyword}</span>
        </div>
        <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
          <span className="text-slate-500 dark:text-slate-300">🏠</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors"
          >
            {url.length > 30 ? `${url.substring(0, 30)}...` : url}
          </a>
        </div>
      </div>

      {/* Bottom accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
} 
