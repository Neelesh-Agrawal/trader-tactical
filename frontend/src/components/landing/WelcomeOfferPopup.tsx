import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'eol_inaugural_offer_dismissed';
const OFFER_IMAGE = `${import.meta.env.BASE_URL}inaugural-offer-popup.png`;

export const WelcomeOfferPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Inaugural offer"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground shadow-lg ring-1 ring-border transition hover:bg-muted"
          aria-label="Close offer popup"
        >
          <X className="h-5 w-5" />
        </button>

        <img
          src={OFFER_IMAGE}
          alt="Inaugural offer: Beginner Module at ₹499. Valid till 31st July 2026."
          className="w-full rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
};
