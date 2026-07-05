import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Flame, User, LogOut, ChevronDown, Menu, X, Award } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface HeaderProps {
  showAuth?: boolean;
  showStreak?: boolean;
}

export const Header = ({ showAuth = true, showStreak = false }: HeaderProps) => {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  const { user, profile, streak, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || 'U';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setActiveSection(href);
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Levels', href: '#levels' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact Us', href: '#contact' }
  ];

  useEffect(() => {
    // Run scroll-spy only on public landing page where sections exist
    if (user || location.pathname !== '/') return;

    const sectionIds = navLinks.map((link) => link.href.slice(1));
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(`#${visible[0].target.id}`);
        }
      },
      {
        // Account for sticky header height
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [user, location.pathname]);

  return (
    <>
      <header
        className="border-b border-border fixed top-0 inset-x-0 z-[100] w-full bg-background shadow-sm lg:sticky lg:top-0 lg:z-50 lg:bg-background/95 lg:shadow-none backdrop-blur supports-[backdrop-filter]:lg:bg-background/95"
        role="banner"
      >
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to={user ? '/dashboard' : '/'}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 hover-scale touch-manipulation"
          aria-label="Easy Option Learning - Go to home"
        >
          <img 
            src={logoSrc}
            alt="Easy Option Learning" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-md"
          />
          <span className="font-display text-lg sm:text-xl font-bold hidden xs:inline">Easy Option Learning</span>
        </Link>

        {/* Desktop Nav Links */}
        {!user && (
          <nav className="hidden lg:flex items-center gap-6 font-ui" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-1 py-1.5 transition-colors duration-300 font-medium text-sm ${
                  activeSection === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 bg-success transition-all duration-300 ${
                    activeSection === link.href ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            ))}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Streak Badge */}
          {showStreak && streak && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-warning/20 text-warning border border-warning/30">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 streak-flame" />
              <span className="mono text-xs sm:text-sm font-medium">{streak.current_streak}</span>
            </div>
          )}

          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1.5 sm:gap-2 px-1.5 sm:px-2 h-9 sm:h-10 touch-manipulation">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-xs sm:text-sm">
                    {getInitials(profile.name)}
                  </div>
                  <span className="hidden sm:block text-sm">{profile.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56 w-max max-w-[calc(100vw-2rem)]">
                <div className="px-3 py-2 min-w-0">
                  <p className="font-medium truncate" title={profile.name}>
                    {profile.name}
                  </p>
                  <p
                    className="text-sm text-muted-foreground break-all"
                    title={profile.email}
                  >
                    {profile.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3 touch-manipulation">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/certificates')} className="py-3 touch-manipulation">
                  <Award className="h-4 w-4 mr-2" />
                  My Certificates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive py-3 touch-manipulation">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : showAuth ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')} 
                className="hidden sm:inline-flex h-9 sm:h-10 px-3 sm:px-4 text-sm touch-manipulation"
              >
                Login
              </Button>
              <Button 
                variant="success"
                onClick={() => navigate('/register')} 
                className="h-9 sm:h-10 px-3 sm:px-4 text-sm touch-manipulation"
              >
                Sign Up
              </Button>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 touch-manipulation"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Menu */}
      {!user && mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`relative w-full max-w-xs text-center py-3 px-4 rounded-lg transition-colors duration-300 font-medium ${
                  activeSection === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 w-12 bg-success transition-all duration-300 ${
                    activeSection === link.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  } origin-center`}
                />
              </button>
            ))}
            <Button 
              variant="ghost" 
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} 
              className="justify-center w-full max-w-xs mt-2"
            >
              Login
            </Button>
          </nav>
        </div>
      )}
      </header>
      <div className="h-14 sm:h-[3.75rem] lg:hidden shrink-0" aria-hidden="true" />
    </>
  );
};
