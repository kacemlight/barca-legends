'use client';

import React from 'react';
import { PageConfig } from '@/types';

interface HeroSectionProps {
  config: PageConfig | null;
  error?: string | null;
}

/**
 * HeroSection Component
 * Displays page header with headline and subtext from PageConfig
 */
export function HeroSection({ config, error = null }: HeroSectionProps) {
  if (error) {
    return (
      <section className="hero-section hero-error">
        <div className="hero-content">
          <h1>FC Barcelona Legends</h1>
          <p>⚠️ {error}</p>
        </div>
        <style jsx>{`
          .hero-section {
            background: linear-gradient(135deg, #8b0000 0%, #660000 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
            margin-bottom: 40px;
          }

          .hero-content {
            max-width: 900px;
            margin: 0 auto;
          }

          h1 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 15px;
          }

          p {
            font-size: 1.25rem;
            margin: 0;
            opacity: 0.95;
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }

            p {
              font-size: 1rem;
            }
          }
        `}</style>
      </section>
    );
  }

  // Default fallback if no config is provided
  const headline = config?.heroHeadline || 'FC Barcelona Legends';
  const subtext = config?.heroSubtext || 'Discover the greatest players in club history';

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>{headline}</h1>
        <p>{subtext}</p>
      </div>
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #004687 0%, #003d7a 100%);
          color: white;
          padding: 60px 20px;
          text-align: center;
          margin-bottom: 40px;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        p {
          font-size: 1.25rem;
          margin: 0;
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }

          p {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
