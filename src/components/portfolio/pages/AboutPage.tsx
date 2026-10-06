"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { PHARMA_FEATURE_CARDS } from '../data/pharmacyData';
import { motion } from 'framer-motion';

const DnaHelix = dynamic(() => import('../3d/DnaHelix').then(m => ({ default: m.DnaHelix })), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'transparent' }} />,
});
import {
  HeartPulse, ShieldCheck, TestTube2, Atom, Network, Sparkles,
  ArrowUpRight, ArrowLeft, Award, CheckCircle2, Microscope,
  FileCheck2, Layers, Flame,
} from 'lucide-react';

function renderCardIcon(iconType: string) {
  switch (iconType) {
    case 'test-tube': return <TestTube2 size={22} color="#ffffff" />;
    case 'shield':    return <ShieldCheck size={22} color="#ffffff" />;
    case 'atom':      return <Atom size={22} color="#ffffff" />;
    case 'network':   return <Network size={22} color="#ffffff" />;
    default:          return <Sparkles size={22} color="#ffffff" />;
  }
}

export function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vision' | 'seo' | 'safety'>('vision');

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--hero-gradient)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button onClick={() => router.push('/portfolio')} className="glass-button-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /><span>Back to Home</span>
          </button>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.08)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(124,58,237,0.2)' }}>
            <HeartPulse size={14} color="#7c3aed" /><span>Official About Us Page</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <div className="glass-pill" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <Microscope size={14} color="var(--primary-accent)" /><span>Bio-Equivalence Spectrometry Certified</span>
            </div>
            <h1 className="font-display gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.18, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Precision Formulations for <span className="gradient-accent-text">Cardiovascular Resilience</span>
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '24px' }}>
              SYNCTIUM Health is dedicated to advancing modern pharmaceutical standards by formulating spectrometry-verified medicines, ensuring absolute active salt transparency, and delivering reliable health solutions trusted by medical professionals and patients worldwide.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '28px' }}>
              {[
                { metric: '99.98%', label: 'API Salt Purity', icon: ShieldCheck, color: '#10b981' },
                { metric: '500+', label: 'Certified Formulations', icon: Award, color: '#7c3aed' },
                { metric: '< 0.01%', label: 'Trace Impurity Rate', icon: FileCheck2, color: '#e11d48' },
                { metric: '100%', label: 'FDA / WHO Standard', icon: CheckCircle2, color: '#0284c7' },
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div key={i} style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <StatIcon size={16} color={stat.color} />
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{stat.metric}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={() => router.push('/portfolio/catalog')} className="glass-button" style={{ padding: '12px 22px', fontSize: '0.9rem' }}>
                <span>Explore Digital Catalog</span><ArrowUpRight size={16} />
              </button>
              <button onClick={() => { router.push('/portfolio'); setTimeout(() => document.getElementById('salt-inspector')?.scrollIntoView({ behavior: 'smooth' }), 300); }} className="glass-button-secondary" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                <Atom size={16} color="var(--primary-accent)" /><span>Inspect Active Salts</span>
              </button>
            </div>
          </div>

          {/* DNA 3D Helix */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            style={{ position: 'relative', height: 'clamp(320px, 50vh, 460px)', width: '100%' }}>
            <DnaHelix />
          </motion.div>
        </div>

        {/* Story Tabs */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {([
              { id: 'vision', label: 'Company Mission & Vision', icon: Sparkles },
              { id: 'seo', label: 'Clinical Verification Schema', icon: ShieldCheck },
              { id: 'safety', label: 'Salt Purity & Safety Standards', icon: TestTube2 },
            ] as const).map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={isActive ? 'glass-button' : 'glass-button-secondary'} style={{ padding: '12px 24px', fontSize: '0.92rem' }}>
                  <IconComponent size={17} /><span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="glass-panel pf-about-tabs-panel" style={{ borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
            {activeTab === 'vision' && (
              <div className="pf-about-vision-grid" style={{ display: 'grid', gap: '32px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--secondary-accent)' }}>Dedicated to Clinical Quality & Chemical Integrity</h3>
                  <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>At SYNCTIUM Health, our mission is to eliminate uncertainty in modern medication by setting rigorous quality standards for Active Pharmaceutical Ingredients (APIs) and salt bio-equivalence.</p>
                  <p style={{ color: '#475569', lineHeight: 1.7 }}>We collaborate with leading research laboratories, trusted pharmacy networks (Apollo Pharmacy, MedPlus, Netmeds), and healthcare providers to ensure every medicine delivers reliable therapeutic outcomes.</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Pharmaceutical Pillars</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {['100% Certified Active Pharmaceutical Ingredients (APIs)', 'Advanced Bio-Availability & Absorption Spectrometry', 'Strict FDA & Regulatory Compliance Protocols', 'Complete Salt Formulation Transparency for Patients'].map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
                        <CheckCircle2 size={18} color="#10b981" /><span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'seo' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--secondary-accent)' }}>Standardized Digital Health & Medicine Verification</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>Every formulation in the SYNCTIUM Health registry carries standardized clinical metadata and structured medical schemas, allowing healthcare providers and patients to instantly verify active salt compositions, recommended dosages, and batch authenticity.</p>
                <div style={{ background: '#0f172a', padding: '24px', borderRadius: '18px', fontFamily: 'monospace', fontSize: '0.88rem', color: '#a7f3d0', overflowX: 'auto', border: '1px solid #1e293b' }}>
                  <pre>{`{
  "@context": "https://schema.org",
  "@type": "MedicalEntity",
  "name": "Precision Cardio-Pure Bio-Active 100mg",
  "activeIngredient": "Amlodipine Besylate 5mg, Telmisartan 40mg",
  "clinicalStandard": "FDA & WHO Spectrometry Certified",
  "bioAvailabilityScore": "99.98%",
  "code": { "@type": "MedicalCode", "code": "SNC-CARD-88401-V" }
}`}</pre>
                </div>
              </div>
            )}
            {activeTab === 'safety' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--secondary-accent)' }}>Rigorous Spectrometry & Bio-Equivalence Certification</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>Our quality assurance team cross-references every formulation with CAS registration numbers, chemical spectrometry logs, and batch purity standards to guarantee maximum bioavailability and safety.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {[
                    { title: 'CAS Registration', desc: 'Registered with global chemical abstract services for full batch auditability.', icon: Layers },
                    { title: 'Bio-Equivalence Testing', desc: 'Tested for maximum human metabolic absorption and minimal side-effects.', icon: Flame },
                    { title: 'Cryptographic QR Verification', desc: 'Batch QR code verification for patient anti-counterfeiting security.', icon: ShieldCheck },
                  ].map((card, i) => {
                    const CardIcon = card.icon;
                    return (
                      <div key={i} style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                          <CardIcon size={20} color="var(--primary-accent)" />
                        </div>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '6px', fontSize: '1.02rem' }}>{card.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{card.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Pharmaceutical Standards</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Four core pillars defining precision medicine formulation and clinical safety.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {PHARMA_FEATURE_CARDS.map((feature, idx) => (
              <motion.div key={feature.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.08 }} whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel"
                style={{ padding: '30px 26px', borderRadius: '24px', position: 'relative', overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(226,232,240,0.9)', boxShadow: '0 10px 30px rgba(99,102,241,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: feature.badgeColor }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: feature.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(124,58,237,0.25)' }}>
                      {renderCardIcon(feature.iconType)}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-accent)', border: '1px solid rgba(99,102,241,0.15)' }}>{feature.tag}</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a', letterSpacing: '-0.02em' }}>{feature.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>{feature.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-accent)', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span>Verified Standard</span><ArrowUpRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
