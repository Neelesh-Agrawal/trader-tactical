import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Flame, TrendingUp, Moon, Sun, User, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  showAuth?: boolean;
  showStreak?: boolean;
}

export const Header = ({ showAuth = true, showStreak = false }: HeaderProps) => {
  const { user, profile, streak, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

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

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50" role="banner">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo - Smaller on mobile */}
        <Link 
          to={user ? '/dashboard' : '/'} 
          className="flex items-center gap-2 hover-scale touch-manipulation"
          aria-label="TradeMaster - Go to home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold hidden xs:inline">TradeMaster</span>
        </Link>

        {/* Nav Links - Desktop only */}
        {!user && (
          <nav className="hidden md:flex items-center gap-8 font-ui" aria-label="Main navigation">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              How It Works
            </a>
            <a href="#levels" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Levels
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              About Us
            </a>
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge - Compact on mobile */}
          {showStreak && streak && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-warning/20 text-warning border border-warning/30">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 streak-flame" />
              <span className="mono text-xs sm:text-sm font-medium">{streak.current_streak}</span>
            </div>
          )}

          {/* Theme Toggle - Smaller on mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
          </Button>

          {user && profile ? (
            <>
              {/* Profile Dropdown */}
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
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3 touch-manipulation">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive py-3 touch-manipulation">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : showAuth ? (
            <Button onClick={() => navigate('/login')} className="gap-2 h-9 sm:h-10 px-3 sm:px-4 text-sm touch-manipulation">
              Sign In
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
