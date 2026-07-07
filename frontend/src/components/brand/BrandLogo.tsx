import { cn } from '@/lib/utils';

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
const mobileLogoSrc = `${import.meta.env.BASE_URL}logo-mobile.png`;

interface BrandLogoProps {
  iconClassName?: string;
  mobileClassName?: string;
  showText?: boolean;
  textClassName?: string;
}

export const BrandLogo = ({
  iconClassName = 'h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-md',
  mobileClassName = 'h-8 w-auto object-contain',
  showText = false,
  textClassName = 'font-display text-lg sm:text-xl font-bold',
}: BrandLogoProps) => (
  <>
    <img
      src={mobileLogoSrc}
      alt="Easy Option Learning"
      className={cn('block sm:hidden', mobileClassName)}
    />
    <img
      src={logoSrc}
      alt="Easy Option Learning"
      className={cn('hidden sm:block shrink-0', iconClassName)}
    />
    {showText && (
      <span className={cn('hidden sm:inline', textClassName)}>Easy Option Learning</span>
    )}
  </>
);
