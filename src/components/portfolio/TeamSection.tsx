"use client";

import { TEAM_MEMBERS } from './data/pharmacyData';
import { Users, Award, Mail } from 'lucide-react';

export function TeamSection() {
  return (
    <section id="team" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <div className="glass-pill" style={{ marginBottom: '16px' }}><Users size={14} color="var(--primary-accent)" /><span>Company Leadership & Staff Showcase</span></div>
          <h2 className="font-display gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Meet the Pharmacists & <span className="gradient-accent-text">Digital Operations Team</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our multi-disciplinary team of pharmaceutical scientists, R&D researchers, digital architects, and logistics specialists driving precision drug digitisation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {TEAM_MEMBERS.map(member => (
            <div key={member.id} className="glass-panel" style={{ padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar} alt={member.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-highlight)', boxShadow: '0 4px 14px var(--primary-glow)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>{member.name}</h3>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-accent)' }}>{member.role}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'var(--badge-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={12} color="var(--primary-accent)" />{member.experience}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>{member.bio}</p>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Credentials & Papers:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {member.credentials.map((cred, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary-accent)' }} />{cred}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a href={`mailto:${member.email}`} className="glass-button-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem', justifyContent: 'center', textDecoration: 'none', color: 'var(--text-main)' }}>
                <Mail size={16} color="var(--secondary-accent)" /><span>Contact {member.name.split(' ')[0]}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
