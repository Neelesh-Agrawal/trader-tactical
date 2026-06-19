import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Download, Loader2 } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthRequired } from '@/config/appConfig';
import { useCertificates } from '@/hooks/useCertificates';

const Certificates = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { certificates, loading: certificatesLoading, downloadCertificate } = useCertificates();

  if (authLoading || certificatesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showStreak />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isAuthRequired() && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showStreak />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="mt-2 text-muted-foreground">
            Download your level completion certificates.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="tactical-card p-8 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No certificates yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete a level assessment to earn your first certificate.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="tactical-card p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Level {certificate.level_order}
                    </p>
                    <h2 className="text-lg font-semibold">{certificate.level_title}</h2>
                    <p className="text-sm text-muted-foreground">{certificate.course_title}</p>
                  </div>
                  <Award className="h-5 w-5 text-warning" />
                </div>

                <p className="mb-4 text-xs text-muted-foreground">
                  Issued on {new Date(certificate.issued_at).toLocaleDateString()}
                </p>

                <Button
                  className="w-full gap-2"
                  onClick={() => downloadCertificate(certificate.id)}
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Certificates;
