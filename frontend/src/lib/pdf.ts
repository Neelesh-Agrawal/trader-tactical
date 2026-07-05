import { toast } from 'sonner';
import { nismConfig } from '@/config/courseConfig';

export const getPdfUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
};

/**
 * Programmatically checks if the PDF exists before opening it in a new tab.
 * Intercepts default anchor behavior to display a toast if the file is missing.
 */
export const openPdf = async (path: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
  if (event) {
    event.preventDefault();
  }

  const pdfUrl = getPdfUrl(path);

  try {
    const res = await fetch(pdfUrl, { method: 'HEAD' });
    if (res.ok) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('The sample PDF is currently unavailable. Please try again later.');
    }
  } catch (error) {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }
};

export const SAMPLE_PDF_PATH = getPdfUrl(nismConfig.samplePdfPath);

export const openSamplePdf = (event?: React.MouseEvent<HTMLAnchorElement>) =>
  openPdf(nismConfig.samplePdfPath, event);
