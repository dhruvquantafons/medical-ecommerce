"use client";

import { useRef, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { submitPartnerInquiryAction } from '@/app/portfolio/actions';
import { Section } from './site';
import { ActionButton, Card, FloatingField, SectionHeader } from './kit';

/*
  Enquiries from pharmacies and distributors. Uses the existing server action unchanged
  (fields: name, email, organisation, optional message).
  Validation runs in the browser when a field is left and on submit; the server action still
  validates on its own.
  TODO(owner): business address, phone, contact email and hours, shown beside the form once supplied.
  TODO(owner): changeui.md Problem 15 suggests a /contact page with an "I am a" field; that needs a
  change to the server action, so it is not done here.
*/

type Key = 'name' | 'email' | 'pharmacyName' | 'message';

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: '' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'name@example.com' },
  { key: 'pharmacyName', label: 'Pharmacy or company', type: 'text', autoComplete: 'organization', placeholder: '' },
] as const;

const EMPTY = { name: '', email: '', pharmacyName: '', message: '' };

function validate(key: Key, value: string): string | undefined {
  const v = value.trim();
  if (key === 'message') return undefined;
  if (!v) {
    if (key === 'name') return 'Enter your full name.';
    if (key === 'email') return 'Enter your email address so we can reply.';
    return 'Enter the name of your pharmacy or company.';
  }
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter an email address in the form name@example.com.';
  return undefined;
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const errorFor = (key: Key) => (touched[key] ? validate(key, formData[key]) : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, pharmacyName: true });
    const firstInvalid = FIELDS.find(f => validate(f.key, formData[f.key]));
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`#pf-${firstInvalid.key}`)?.focus();
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await submitPartnerInquiryAction(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData(EMPTY);
        setTouched({});
      } else {
        setErrorMsg(res.error || 'Your message was not sent. Check the fields and try again.');
      }
    } catch {
      setErrorMsg('Your message was not sent because of a connection problem. Try again in a minute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="contact"
      labelledBy="pf-contact-title"
      tone="surface"
      curveFrom="default"
      reveal
      backdrop={{ washes: [{ at: 'tl', color: 'orchid', size: 0.5 }, { at: 'br', color: 'violet', size: 0.45 }], pattern: 'dots', patternFrom: 'br' }}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
        <SectionHeader
          id="pf-contact-title"
          layout="stack"
          title="Stock our range"
          lead="Tell us about your pharmacy or business and which products you are interested in. We reply by email."
          className="lg:sticky lg:top-28"
        />

        <Card elevation={2} className="rounded-[20px] p-5 sm:p-8">
          {submitted ? (
            <div role="status" className="flex flex-col items-start py-4">
              <svg viewBox="0 0 48 48" className="size-14 text-success" aria-hidden="true">
                <circle cx="24" cy="24" r="21" fill="#e4f4ec" />
                <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" pathLength={1} className="pf-check-circle" />
                <path d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pf-check-tick" />
              </svg>
              <p className="mt-5 font-display text-[24px] font-semibold tracking-[-0.02em] text-foreground">Message sent</p>
              <p className="mt-2 text-muted-foreground">We will reply to the email address you gave us.</p>
              <ActionButton variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
                Send another message
              </ActionButton>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-describedby="pf-contact-for">
              <p id="pf-contact-for" className="mb-6 text-[15px] font-semibold text-foreground">
                For pharmacies and distributors
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map(({ key, label, type, autoComplete, placeholder }) => (
                  <FloatingField
                    key={key}
                    id={`pf-${key}`}
                    label={label}
                    type={type}
                    required
                    autoComplete={autoComplete}
                    placeholder={placeholder || undefined}
                    value={formData[key]}
                    onValueChange={v => setFormData(d => ({ ...d, [key]: v }))}
                    onBlur={() => formData[key] && setTouched(t => ({ ...t, [key]: true }))}
                    error={errorFor(key)}
                    valid={touched[key] && !validate(key, formData[key])}
                    className={key === 'pharmacyName' ? 'sm:col-span-2' : undefined}
                  />
                ))}
                <FloatingField
                  multiline
                  id="pf-message"
                  label="Message"
                  optional
                  rows={4}
                  value={formData.message}
                  onValueChange={v => setFormData(d => ({ ...d, message: v }))}
                  className="sm:col-span-2"
                />
              </div>

              {errorMsg && (
                <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[15px] text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {errorMsg}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ActionButton type="submit" size="lg" disabled={loading} arrow={!loading} aria-busy={loading || undefined}>
                  {/* The spinner is live: it runs only while the message is being sent. */}
                  {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Sending…' : 'Send message'}
                </ActionButton>
              </div>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}
