"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { submitPartnerInquiryAction } from '@/app/portfolio/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Section, SectionHeading } from './site';

/*
  Enquiries from pharmacies and distributors. Uses the existing server action unchanged
  (fields: name, email, organisation, optional message).
  TODO(owner): business address, phone, contact email and hours, shown beside the form once supplied.
  TODO(owner): changeui.md Problem 15 suggests a /contact page with an "I am a" field; that needs a
  change to the server action, so it is not done here.
*/

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Your full name' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'name@example.com' },
  { key: 'pharmacyName', label: 'Pharmacy or company', type: 'text', autoComplete: 'organization', placeholder: 'Pharmacy or company name' },
] as const;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', pharmacyName: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await submitPartnerInquiryAction(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', pharmacyName: '', message: '' });
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
    <Section id="contact" labelledBy="pf-contact-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <SectionHeading
          id="pf-contact-title"
          eyebrow="Pharmacies and distributors"
          title="Stock our range"
          lead="Tell us about your pharmacy or business and which products you are interested in. We reply by email."
        />

        <div className="rounded-lg border border-border p-5 sm:p-8">
          {submitted ? (
            <div role="status" className="space-y-4">
              <p className="text-lg font-medium text-success">Message sent.</p>
              <p className="text-muted-foreground">We will reply to the email address you gave us.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5" noValidate={false}>
              {FIELDS.map(({ key, label, type, autoComplete, placeholder }) => (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={`pf-${key}`} className="text-[15px]">{label}</Label>
                  <Input
                    id={`pf-${key}`}
                    type={type}
                    required
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="grid gap-2">
                <Label htmlFor="pf-message" className="text-[15px]">
                  Message <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="pf-message"
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              {errorMsg && (
                <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-[15px] text-destructive">
                  {errorMsg}
                </p>
              )}
              <Button type="submit" disabled={loading} className="justify-self-start">
                {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                {loading ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
