/**
 * AuthChartHero - NIFTY-style trading chart for login/signup
 * Clean, professional layout. White background, site color palette.
 */
export const AuthChartHero = () => {
  // Data spans full width (Jan–May), gentler slope for balanced proportions
  const points = [
    { x: 5, y: 68 },
    { x: 25, y: 62 },
    { x: 45, y: 48 },
    { x: 65, y: 35 },
    { x: 85, y: 18 },
  ];
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 bg-white dark:bg-[#fafafa]">
      <div className="w-full max-w-[500px] rounded-xl border border-[hsl(var(--border))] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[hsl(var(--border))]">
          <span className="text-sm font-medium text-muted-foreground">NIFTY 50 · LIVE</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            MARKET OPEN
          </span>
        </div>

        {/* Chart */}
        <div className="relative px-5 pt-4 pb-5">
          {/* Tooltip */}
          <div className="absolute right-5 top-5 rounded-lg border border-primary/25 bg-card px-3 py-2 shadow-sm">
            <p className="text-[10px] font-medium text-primary uppercase tracking-wide">NIFTY 50</p>
            <p className="text-xl font-bold text-foreground tracking-tight">21,847</p>
            <p className="text-xs font-medium text-primary">+1.42%</p>
          </div>

          <svg
            viewBox="0 0 100 80"
            className="w-full h-[220px] min-h-[180px]"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <pattern id="auth-grid" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.35" fill="hsl(var(--muted-foreground) / 0.12)" />
              </pattern>
              <linearGradient id="auth-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--success))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <rect width="100" height="80" fill="url(#auth-grid)" />
            <line x1="5" y1="68" x2="95" y2="68" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="0.35" strokeDasharray="2 2" />
            <path d={pathD} fill="none" stroke="url(#auth-line)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 1.2 : 0.8}
                fill={i === 2 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              />
            ))}
            <circle cx="85" cy="18" r="3" fill="hsl(var(--primary) / 0.15)" />
          </svg>

          {/* X-axis */}
          <div className="flex justify-between mt-2 text-[11px] text-muted-foreground font-medium tracking-wide">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
          </div>
        </div>
      </div>
    </div>
  );
};
