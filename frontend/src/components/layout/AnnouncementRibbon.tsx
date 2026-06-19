import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { nismConfig } from '@/config/courseConfig';

export const AnnouncementRibbon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!nismConfig.enabled) {
    return null;
  }

  const handleClick = () => {
    if (location.pathname === '/') {
      document.getElementById('nism')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // After navigation, wait for DOM then scroll
      setTimeout(() => {
        document.getElementById('nism')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-success/8 border-b border-success/15 hover:bg-success/12 transition-colors duration-200 group"
      style={{ minHeight: '44px' }}
      aria-label="View NISM VIII Equity Derivatives resource"
    >
      <span className="text-xs sm:text-sm font-medium text-success/90 group-hover:text-success transition-colors duration-200 text-center leading-snug">
        {nismConfig.announcementText}
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-success/70 group-hover:text-success group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
    </button>
  );
};
