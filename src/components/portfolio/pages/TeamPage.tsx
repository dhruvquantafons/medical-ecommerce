"use client";

import { useRouter } from 'next/navigation';
import { Users, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Employee } from '@/lib/employees';

interface TeamPageProps {
  members: Employee[];
}

export function TeamPage({ members }: TeamPageProps) {
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

        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '1rem' }}>
            No team members added yet. Add them from the admin panel.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel"
                style={{ borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(99,102,241,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Full-width portrait photo */}
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem', color: '#7c3aed', fontWeight: 800 }}>
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Name, role, contact */}
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>{member.name}</h3>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '10px' }}>{member.role}</div>
                  <a
                    href={member.email ? `mailto:${member.email}` : `mailto:contact@syncytiumhealth.com?subject=Message for ${encodeURIComponent(member.name)}`}
                    className="glass-button-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center', textDecoration: 'none', color: '#0f172a', fontWeight: 700 }}
                  >
                    <Mail size={14} color="var(--primary-accent)" />
                    <span>{member.email ? member.email : 'Contact'}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
