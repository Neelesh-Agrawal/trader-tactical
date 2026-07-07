import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useProgress } from '@/hooks/useProgress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/landing/Footer';
import { QnAWidget } from '@/components/qna/QnAWidget';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Target, TrendingUp, CheckCircle, ArrowRight, Lock, Check, Download } from 'lucide-react';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { Link } from 'react-router-dom';
import { getPdfUrl, openPdf } from '@/lib/pdf';
import { courseConfigList, nismConfig, nismLevelDisplay, NISM_LEVEL_SLUG, siteConfig } from '@/config/courseConfig';
import { useNismCheckout } from '@/hooks/useNismCheckout';
import { getCurrentLevel } from '@/lib/currentLevel';
import type { Level } from '@/hooks/useCourses';

const Dashboard = () => {
  const { profile, streak } = useAuth();
  const { levels, loading: coursesLoading, error: coursesError } = useCourses();
  const { startNismCheckout } = useNismCheckout();
  const {
    isLevelCompleted,
    isLessonCompleted,
    lessonProgress,
  } = useProgress();

  const getCurrentLevelForDashboard = () =>
    getCurrentLevel(levels, isLevelCompleted, isLessonCompleted);

  const currentLevel = getCurrentLevelForDashboard();
  const backendLevelsById = new Map(levels.map((level) => [level.id, level]));

  const learningPathConfigs = [
    ...courseConfigList.filter((config) => backendLevelsById.has(config.id)),
    ...(nismConfig.enabled ? [nismLevelDisplay] : []),
  ];

  const completedLessons = (lessonProgress || []).filter((l) => l.completed).length;

  const getLevelProgressPercent = (level: Level): number => {
    let total = 0;
    let completed = 0;
    for (const module of level.modules) {
      for (const lesson of module.lessons) {
        total += 1;
        if (isLessonCompleted(level.id, module.id, lesson.id)) {
          completed += 1;
        }
      }
    }
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getLevelStatus = (level: Level): 'completed' | 'active' | 'locked' => {
    if (isLevelCompleted(level.id)) return 'completed';
    if (level.is_enrolled) return 'active';
    if (!level.is_unlocked) return 'locked';
    return 'active';
  };

  const getNextMilestone = () => {
    for (const level of levels) {
      for (const module of level.modules) {
        const hasIncompleteLesson = module.lessons.some(
          (lesson) => !isLessonCompleted(level.id, module.id, lesson.id)
        );
        if (hasIncompleteLesson) {
          return `Module ${module.order}: ${module.title}`;
        }
      }
    }
    return 'All modules complete!';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showStreak />
      <QnAWidget contextType="dashboard" />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl flex-1">
        {/* Top Overview */}
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[32px] border border-border/70 bg-card/95 p-6 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.12)] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Dashboard</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  Welcome back, {profile?.name ? profile.name.split(' ')[0] || 'Learner' : 'Learner'}
                </h1>
                <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
                Glad to see you👋 You’ve made great progress so far — keep going 🚀
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-border bg-muted/50 p-4 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Current level</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{currentLevel?.title || 'Level'}</p>
                </div>
                <div className="rounded-3xl border border-border bg-muted/50 p-4 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Lessons completed</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{completedLessons}</p>
                </div>
                <div className="rounded-3xl border border-border bg-muted/50 p-4 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Streak</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{streak?.current_streak || 0} days</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] font-semibold text-muted-foreground">Next milestone</p>
                    <p className="mt-2 text-sm sm:text-base text-foreground">{getNextMilestone()}</p>
                  </div>
                  <div className="inline-flex items-center rounded-2xl bg-primary/10 px-3 py-2 text-primary font-medium text-xs">
                    <Target className="mr-2 h-4 w-4" /> Focus mode
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-card/95 p-5 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.12)] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/70">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Continue learning</p>
                <p className="mt-1 text-sm text-foreground/80">The little progress you make every day adds up to remarkable growth. 🌱</p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-2 text-primary text-xs font-semibold">Live</div>
            </div>
            <div className="mt-5">
              <ContinueLearning />
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground">Your learning path</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Your learning roadmap</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                From beginner to advanced — plus NISM certification prep.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              4 learning tracks
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {coursesLoading && (
              <>
                <CardSkeleton variant="level" />
                <CardSkeleton variant="level" />
                <CardSkeleton variant="level" />
                <CardSkeleton variant="level" />
              </>
            )}

            {!coursesLoading && levels.length === 0 && (
              <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">
                  {coursesError || 'No course levels found. Ask your admin to run: python manage.py seed_course'}
                </p>
              </div>
            )}

            {!coursesLoading && learningPathConfigs.map((config, index) => {
              const level = backendLevelsById.get(config.id);
              const levelId = config.id;
              const isNism = levelId === NISM_LEVEL_SLUG;
              const status = level ? getLevelStatus(level) : 'locked';
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const isActive = status === 'active';
              const progress = level ? getLevelProgressPercent(level) : 0;
              const cardLink = `/level/${levelId}`;

              const title = level?.title || config.name || levelId;
              const description = config.description ?? '';
              const modules = level?.modules ?? config.points.map((point, pointIndex) => ({ id: `${config.id}-${pointIndex}`, title: point }));
              const price = `₹${config.price}`;
              const emoji = config.emoji ?? '📚';
              const badge = config.badge ?? `Level ${config.number}`;
              const bestFor = config.bestFor ?? '';

              return (
                <AnimatedSection key={config.id} direction="up" delay={120 + index * 100}>
                  <div
                    className={`db-card relative flex flex-col h-full rounded-2xl border p-6 bg-card transition-all duration-300 ${
                      isCompleted ? 'border-success/40 shadow-md' :
                      isActive ? 'border-success/50 shadow-xl shadow-success/10' :
                      'border-border shadow-md opacity-90'
                    }`}
                  >
                    <style>{`
                      .db-card {
                        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
                      }
                      .db-card:hover {
                        transform: translateY(-8px) scale(1.015);
                        box-shadow: 0 24px 48px -12px hsla(160,72%,33%,0.18), 0 8px 16px -4px hsla(160,72%,33%,0.08);
                      }
                      .db-cta-btn {
                        transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
                      }
                      .db-cta-btn:hover {
                        transform: translateY(-2px) scale(1.03);
                        box-shadow: 0 8px 24px -4px hsla(160,72%,33%,0.4);
                      }
                      .db-cta-btn:active { transform: scale(0.97); }
                    `}</style>

                    {/* Active badge */}
                    {isActive && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-success text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                        In Progress
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-success uppercase tracking-widest">{badge}</p>
                            <h3 className="text-lg font-bold text-foreground">{title}</h3>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isCompleted ? 'bg-success/10 text-success' :
                          isActive ? 'bg-success/10 text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted && <CheckCircle className="h-3 w-3" />}
                          {isLocked && <Lock className="h-3 w-3" />}
                          {isActive && <TrendingUp className="h-3 w-3" />}
                          {isCompleted ? 'Completed' : isActive ? 'Active' : 'Locked'}
                        </div>
                      </div>
                      {description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                      )}
                    </div>

                    {/* Price (locked only) OR Progress (unlocked) */}
                    <div className="mb-5 pb-5 border-b border-border">
                      {isLocked ? (
                        <>
                          <div className="flex items-end gap-1.5">
                            <span className="text-4xl font-bold text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' }}>
                              {price}
                            </span>
                            <span className="text-sm text-muted-foreground mb-1.5">one-time</span>
                          </div>
                          <div className="mt-3 px-3 py-2 rounded-lg bg-success/8 border border-success/15">
                            <p className="text-xs font-bold text-success uppercase tracking-wide mb-0.5">Best For</p>
                            <p className="text-xs font-semibold text-foreground leading-snug">
                              {bestFor}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Progress</span>
                            <span className="text-sm font-bold font-mono text-success">{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-success transition-all duration-700"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {isCompleted && (
                            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-success/8 border border-success/15">
                              <CheckCircle className="h-4 w-4 text-success shrink-0" />
                              <p className="text-xs font-semibold text-success">Level Complete — Certificate Earned!</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Modules list */}
                    <div className="mb-6 flex-1">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">What you'll master</p>
                      <ul className="space-y-2.5">
                        {modules.slice(0, 5).map((module) => (
                          <li key={module.id} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isLocked ? 'bg-muted' : 'bg-success/10'
                            }`}>
                              {isLocked
                                ? <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                                : <Check className="w-2.5 h-2.5 text-success" />}
                            </div>
                            <span className={`text-sm leading-snug ${isLocked ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>{module.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto flex flex-col gap-3">
                      {isLocked && isNism ? (
                        <button
                          type="button"
                          onClick={() => void startNismCheckout()}
                          className="db-cta-btn inline-flex items-center justify-center w-full rounded-xl h-11 text-sm font-semibold shadow-md bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white"
                        >
                          Unlock — {price}
                        </button>
                      ) : (
                        <Link
                          to={isLocked ? `/pricing?level=${config.id}` : cardLink}
                          className={`db-cta-btn inline-flex items-center justify-center w-full rounded-xl h-11 text-sm font-semibold shadow-md ${
                            isLocked
                              ? 'bg-success/10 text-success border border-success/30 hover:bg-success hover:text-white'
                              : 'bg-success text-white'
                          }`}
                        >
                          {isLocked ? 'Unlock — ' + price : isCompleted ? 'View Lessons' : 'Continue Learning'}
                          {!isLocked && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Link>
                      )}
                      {config.samplePdfPath && config.sampleDownloadCTA && (
                        <a
                          href={getPdfUrl(config.samplePdfPath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => openPdf(config.samplePdfPath!, e)}
                          className="inline-flex items-center justify-center gap-2 w-full rounded-xl h-11 text-sm font-semibold border border-success/30 text-success bg-success/5 hover:bg-success/10 transition-transform duration-200 hover:-translate-y-px"
                        >
                          <Download className="w-4 h-4" />
                          {config.sampleDownloadCTA}
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* Telegram Community */}
        <section className="mb-10">
          <AnimatedSection direction="up" delay={100}>
            <div className="relative overflow-hidden rounded-2xl border border-success/30 bg-card shadow-lg shadow-success/5 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-success/10 hover:border-success/50">
              <style>{`
                @keyframes tg-float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-6px) scale(1.05)} }
                @keyframes tg-glow { 0%,100%{box-shadow:0 0 0 0 hsla(160,72%,33%,0.3)} 50%{box-shadow:0 0 0 10px hsla(160,72%,33%,0)} }
                @keyframes tg-btn { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
                .tg-icon { animation: tg-float 3s ease-in-out infinite; }
                .tg-icon-wrap { animation: tg-glow 3s ease-in-out infinite; }
                .tg-btn { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease; }
                .tg-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px -4px hsla(160,72%,33%,0.4); }
                .tg-btn:active { transform: scale(0.97); }
              `}</style>

              {/* Background glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-success/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-success/5 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Telegram icon */}
                <div className="tg-icon-wrap shrink-0 w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <div className="tg-icon">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-success" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🚀</span>
                    <h3 className="text-lg font-bold text-foreground">Don't Trade Alone</h3>
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold uppercase tracking-wider border border-success/20">Community</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    The best traders ask questions, share ideas, and learn from others. Join our Telegram community for discussions, doubts &amp; feedback.
                  </p>
                </div>

                {/* CTA */}
                <a
                  href={siteConfig.telegramSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tg-btn shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-success text-white text-sm font-semibold shadow-md whitespace-nowrap"
                >
                  Join the Conversation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
