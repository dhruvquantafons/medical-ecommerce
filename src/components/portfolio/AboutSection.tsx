"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutSection() {
  const router = useRouter();

  return (
    <section id="about" style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="glass-pill" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="var(--primary-accent)" />
              <span>Better Together • SYNCTIUM Health</span>
            </div>
            <h2 className="font-display gradient-text" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '18px' }}>
              Precision Pharmaceutical <span className="gradient-accent-text">Excellence</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '22px' }}>
              SYNCTIUM Health is dedicated to setting new benchmarks in modern healthcare by engineering spectrometry-verified active salt formulations, ensuring complete chemical transparency, and delivering reliable patient-centric medicines.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                '100% Certified Active Pharmaceutical Ingredients (APIs)',
                'Spectrometry-Verified Bio-Equivalence & Absorption',
                'Transparent Formulations Trusted by Clinicians & Patients',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#334155', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="#7c3aed" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/portfolio/about')} className="glass-button" style={{ padding: '13px 26px', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 10px 25px rgba(124,58,237,0.22)' }}>
              <span>Discover Our Full Story</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(124,58,237,0.25), 0 4px 16px rgba(0,0,0,0.15)', border: '1px solid rgba(168,85,247,0.4)', background: '#0a0518', height: '460px' }}
            >
              <video src="/portfolio/dna_vortex.mp4" poster="/portfolio/dna_vortex.jpg" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 35px rgba(168,85,247,0.25)', borderRadius: '28px' }} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
