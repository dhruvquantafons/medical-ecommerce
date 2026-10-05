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
    <section id="contact" style={{ padding: '100px 24px 40px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}>
            <Mail size={14} color="var(--primary-accent)" />
            <span>Connect & Partner Portal</span>
          </div>
          <h2 className="font-display gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Digitize Your Pharmacy with <span className="gradient-accent-text">SYNCTIUM Health</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Ready to convert your physical medicine inventory into a 3D digital showcase indexed on Google? Reach out to our digital pharmacy architects.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', marginBottom: '80px' }}>
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px' }}>Partner Request Form</h3>
            {submitted ? (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#059669' }}>
                <ShieldCheck size={40} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Request Received!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Our SYNCTIUM Health pharmaceutical leads will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Dr. Sarah Connor' },
                  { label: 'Work Email', key: 'email', type: 'email', placeholder: 'sarah@pharmacybrand.com' },
                  { label: 'Pharmacy / Brand Name', key: 'pharmacyName', type: 'text', placeholder: 'Apex Care Pharmacy LLC' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
                    <input type={type} required placeholder={placeholder} value={formData[key as keyof typeof formData]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Integration Requirements</label>
                  <textarea rows={4} placeholder="Describe your current e-commerce store and number of medicine SKUs..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" className="glass-button" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  <Send size={16} /><span>Submit Partner Inquiry</span>
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>Global Headquarters & Labs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: MapPin, title: 'SYNCTIUM Health Bio-Tech Tower', sub: '450 Genomics Way, Suite 1200, Boston MA 02115' },
                  { icon: Mail, title: 'Digital API Support', sub: 'partners@synctium-health.com' },
                  { icon: Phone, title: 'Direct Pharmacist Line', sub: '+1 (800) 555-SYNCTIUM' },
                ].map(({ icon: Icon, title, sub }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--badge-bg)', color: 'var(--secondary-accent)' }}><Icon size={20} /></div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ShieldCheck size={36} color="var(--secondary-accent)" />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>Google Schema & FDA Compliant Data</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>All digitised medicine specs follow standard clinical entity guidelines.</div>
              </div>
            </div>
          </div>
        </div>

        <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={20} color="var(--primary-accent)" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>SYNCTIUM Health 3D Pharmacy Showcase</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#hero-3d" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FDA Disclaimer</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
