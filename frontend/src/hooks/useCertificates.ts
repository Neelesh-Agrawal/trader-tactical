import { useCallback, useEffect, useState } from 'react';

import { apiFetch, getAuthTokens } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Certificate {
  id: number;
  certificate_id: string;
  level: number;
  level_title: string;
  level_order: number;
  course_title: string;
  issued_at: string;
  storage_backend: string;
  download_url: string;
}

export const useCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = useCallback(async () => {
    if (!user) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<Certificate[]>('/api/progress/certificates/');
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const downloadCertificate = useCallback(async (certificateId: number) => {
    const tokens = getAuthTokens();
    const response = await fetch(
      `${API_BASE_URL}/api/progress/certificates/${certificateId}/download/`,
      {
        method: 'GET',
        headers: tokens?.access
          ? {
              Authorization: `Bearer ${tokens.access}`,
            }
          : {},
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download certificate: ${response.status}`);
    }

    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `certificate-${certificateId}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(fileUrl);
  }, []);

  return {
    certificates,
    loading,
    refreshCertificates: fetchCertificates,
    downloadCertificate,
  };
};
