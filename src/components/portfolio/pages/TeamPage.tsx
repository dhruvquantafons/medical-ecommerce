"use client";

import { useRouter } from 'next/navigation';
import { TEAM_MEMBERS } from '../data/pharmacyData';
import { Users, Award, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function TeamPage() {
  const router = useRouter();

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--hero-gradient)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <button onClick={() => router.push('/portfolio')} className="glass-button-secondary" style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /><span>Back to Home</span>
        </button>

        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}>
            <Users size={14} color="var(--primary-accent)" /><span>Dedicated Team & Employ Showcase</span>
          </div>
          <h1 className="font-display gradient-text" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 800, marginBottom: '16px' }}>
            Meet the Pharmacists & <span className="gradient-accent-text">Research Scientists</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.65 }}>
            Our multi-disciplinary team of pharmaceutical scientists, R&D researchers, quality assurance specialists, and medical advisors driving precision medicine formulations for SYNCYTIUM Health.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-panel"
              style={{ padding: '32px 28px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(99,102,241,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar} alt={member.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 6px 20px rgba(124,58,237,0.2)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>{member.name}</h3>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-accent)' }}>{member.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-accent)', border: '1px solid rgba(99,102,241,0.15)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={12} />{member.experience}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="#10b981" />{member.department}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, marginBottom: '22px' }}>{member.bio}</p>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Credentials & Specializations:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {member.credentials.map((cred, i) => (
                      <li key={i} style={{ fontSize: '0.82rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)' }} /><span>{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a href={`mailto:${member.email}`} className="glass-button-secondary" style={{ padding: '11px 18px', fontSize: '0.88rem', justifyContent: 'center', textDecoration: 'none', color: '#0f172a', fontWeight: 700 }}>
                <Mail size={16} color="var(--primary-accent)" /><span>Contact {member.name.split(' ')[0]}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
