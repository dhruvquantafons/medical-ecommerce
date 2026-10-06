"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DnaHelix = dynamic(() => import('./3d/DnaHelix').then(m => ({ default: m.DnaHelix })), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'transparent' }} />,
});

export function AboutSection() {
  const router = useRouter();

  return (
    <section id="about" className="pf-section pf-about-section" style={{ padding: '70px 20px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div className="pf-about-text-col">
            <div className="glass-pill" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="var(--primary-accent)" />
              <span>Better Together • SYNCYTIUM Health</span>
            </div>
            <h2 className="font-display gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
              Precision Pharmaceutical <span className="gradient-accent-text">Excellence</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '20px' }}>
              SYNCYTIUM Health is dedicated to setting new benchmarks in modern healthcare by engineering spectrometry-verified active salt formulations, ensuring complete chemical transparency, and delivering reliable patient-centric medicines.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
              {[
                '100% Certified Active Pharmaceutical Ingredients (APIs)',
                'Spectrometry-Verified Bio-Equivalence & Absorption',
                'Transparent Formulations Trusted by Clinicians & Patients',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="#7c3aed" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/portfolio/about')} className="glass-button" style={{ padding: '13px 26px', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 10px 25px rgba(124,58,237,0.22)' }}>
              <span>Discover Our Full Story</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="pf-about-dna-col" style={{ position: 'relative', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              style={{ position: 'relative', height: 'clamp(280px, 45vh, 440px)', width: '100%' }}
            >
              <DnaHelix />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
