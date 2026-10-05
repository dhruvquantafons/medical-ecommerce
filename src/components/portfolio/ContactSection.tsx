"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Pill } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', pharmacyName: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="pf-section" style={{ padding: '70px 20px 40px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div className="glass-pill" style={{ marginBottom: '14px' }}>
            <Mail size={14} color="var(--primary-accent)" />
            <span>Connect & Partner Portal</span>
          </div>
          <h2 className="font-display gradient-text" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, marginBottom: '14px' }}>
            Digitize Your Pharmacy with <span className="gradient-accent-text">SYNCTIUM Health</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Ready to convert your physical medicine inventory into a 3D digital showcase indexed on Google? Reach out to our digital pharmacy architects.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          <div className="glass-panel" style={{ padding: '28px 20px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px' }}>Partner Request Form</h3>
            {submitted ? (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '16px', padding: '20px', textAlign: 'center', color: '#059669' }}>
                <ShieldCheck size={36} style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Request Received!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Our SYNCTIUM Health pharmaceutical leads will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Dr. Sarah Connor' },
                  { label: 'Work Email', key: 'email', type: 'email', placeholder: 'sarah@pharmacybrand.com' },
                  { label: 'Pharmacy / Brand Name', key: 'pharmacyName', type: 'text', placeholder: 'Apex Care Pharmacy LLC' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{label}</label>
                    <input type={type} required placeholder={placeholder} value={formData[key as keyof typeof formData]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Integration Requirements</label>
                  <textarea rows={4} placeholder="Describe your current e-commerce store and number of medicine SKUs..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" className="glass-button" style={{ justifyContent: 'center', marginTop: '6px' }}>
                  <Send size={16} /><span>Submit Partner Inquiry</span>
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '28px 20px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px' }}>Global Headquarters & Labs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: MapPin, title: 'SYNCTIUM Health Bio-Tech Tower', sub: '450 Genomics Way, Suite 1200, Boston MA 02115' },
                  { icon: Mail, title: 'Digital API Support', sub: 'partners@synctium-health.com' },
                  { icon: Phone, title: 'Direct Pharmacist Line', sub: '+1 (800) 555-SYNCTIUM' },
                ].map(({ icon: Icon, title, sub }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--badge-bg)', color: 'var(--secondary-accent)', flexShrink: 0 }}><Icon size={18} /></div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ShieldCheck size={32} color="var(--secondary-accent)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>Google Schema & FDA Compliant Data</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>All digitised medicine specs follow standard clinical entity guidelines.</div>
              </div>
            </div>
          </div>
        </div>

        <footer className="pf-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Pill size={18} color="var(--primary-accent)" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>SYNCTIUM Health 3D Pharmacy Showcase</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
          <div className="pf-footer-links" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FDA Disclaimer</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
