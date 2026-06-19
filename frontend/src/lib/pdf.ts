import { toast } from 'sonner';
import { nismConfig } from '@/config/courseConfig';

// Helper to construct path with base URL
const getPdfPath = () => {
  const path = nismConfig.samplePdfPath;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
};

export const SAMPLE_PDF_PATH = getPdfPath();

/**
 * Programmatically checks if the PDF exists before opening it in a new tab.
 * Intercepts default anchor behavior to display a toast if the file is missing.
 */
export const openSamplePdf = async (event?: React.MouseEvent<HTMLAnchorElement>) => {
  if (event) {
    event.preventDefault();
  }

  const pdfUrl = getPdfPath();

  try {
    const res = await fetch(pdfUrl, { method: 'HEAD' });
    if (res.ok) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('The sample PDF is currently unavailable. Please try again later.');
    }
  } catch (error) {
    // Fallback to opening directly if network check fails
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }
};
