import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { typography } from '@/design-system';

export interface RegisterFormData {
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
}

interface RegisterDetailsStepProps {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  countryCode: string;
  setCountryCode: (val: string) => void;
  loading: boolean;
  showTermsModal: boolean;
  setShowTermsModal: (val: boolean) => void;
  onNext: () => void;
  occupationOptions: Array<{ value: string; label: string }>;
}

export const RegisterDetailsStep: React.FC<RegisterDetailsStepProps> = ({
  formData,
  setFormData,
  countryCode,
  setCountryCode,
  loading,
  showTermsModal,
  setShowTermsModal,
  onNext,
  occupationOptions,
}) => {
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="name" className="mono text-xs text-muted-foreground mb-2 block">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoComplete="name"
            className="transition-shadow duration-200 focus:shadow-md focus:shadow-success/10"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mono text-xs text-muted-foreground mb-2 block">
            Phone number
          </label>
          <div className="flex gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">🇮🇳 +91</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phoneNumber: value });
              }}
              required
              autoComplete="tel"
              className="flex-1 transition-shadow duration-200 focus:shadow-md focus:shadow-success/10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mono text-xs text-muted-foreground mb-2 block">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
            className="transition-shadow duration-200 focus:shadow-md focus:shadow-success/10"
          />
        </div>

        <div>
          <label htmlFor="occupation" className="mono text-xs text-muted-foreground mb-2 block">
            OCCUPATION
          </label>
          <Select
            value={formData.occupation}
            onValueChange={(value) => setFormData({ ...formData, occupation: value })}
          >
            <SelectTrigger id="occupation">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {occupationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By continuing, you accept the{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="text-primary hover:underline font-medium underline-offset-2"
          >
            T&Cs
          </button>
        </p>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? 'Please wait...' : 'Continue'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0 shrink-0">
            <DialogTitle className="font-display">Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 font-body">
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>1. Introduction</h3>
              <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                These Terms and Conditions ("Terms") govern the use of the website www.easyoptionlearning.com ("Website"), 
                owned and operated by Ananta Securities Private Limited ("Company", "We", "Us", "Our"). 
                By accessing or enrolling in any course offered on this Website, you agree to be legally bound by these Terms.
              </p>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>2. Nature of Services</h3>
              <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                <li>The Website provides educational content related to options trading and financial markets.</li>
                <li>The content includes video lectures, written materials, webinars, and downloadable resources.</li>
                <li>The services are strictly educational. The Company does not provide investment advisory services or stock tips.</li>
              </ul>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>3. Eligibility</h3>
              <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                <li>Users must be at least 18 years of age.</li>
                <li>By enrolling, you confirm you are legally competent to enter into a binding contract.</li>
              </ul>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>4. User Account & Responsibilities</h3>
              <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                <li>You must provide accurate information during registration.</li>
                <li>Login credentials are confidential. Sharing course access is strictly prohibited.</li>
                <li>The Company reserves the right to suspend or terminate accounts for misuse.</li>
              </ul>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>5. Intellectual Property Rights</h3>
              <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                <li>All content is the exclusive property of Ananta Securities Private Limited.</li>
                <li>No content may be copied, reproduced, or redistributed without written permission.</li>
              </ul>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>6. Payment Terms</h3>
              <ul className={`${typography.body.sm} text-muted-foreground leading-relaxed list-disc pl-6 space-y-1`}>
                <li>All course fees must be paid in full before access is granted.</li>
                <li>Prices are subject to change. Payments are governed by our Refund Policy.</li>
              </ul>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>7. Limitation of Liability</h3>
              <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                The Company shall not be liable for trading losses, indirect damages, or loss of profits. 
                Users are solely responsible for their trading decisions.
              </p>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>8. Termination</h3>
              <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                The Company may terminate access for violation of Terms, modify content, or discontinue services.
              </p>
            </section>
            <section>
              <h3 className={`${typography.heading.h4} font-display mb-2`}>9. Governing Law</h3>
              <p className={`${typography.body.sm} text-muted-foreground leading-relaxed`}>
                These Terms are governed by the laws of India. Disputes shall be subject to courts in Ernakulam, Kerala.
              </p>
            </section>
            <p className={`${typography.body.xs} text-muted-foreground italic`}>
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
