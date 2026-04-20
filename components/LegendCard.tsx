'use client';

import React from 'react';
import Link from 'next/link';
import { Legend } from '@/types';
import { legendToSlug } from '@/lib/aem';

interface LegendCardProps {
  legend: Legend;
}

/**
 * LegendCard Component
 * Displays a player card in the listing view with name, position, era, and key stats
 */
export function LegendCard({ legend }: LegendCardProps) {
  const slug = legendToSlug(legend.name);
  const positionLabel = legend.position
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const photoUrl = legend.photo?._publishUrl || legend.photo?._path;

  return (
    <Link href={`/legends/${slug}`}>
      <article className="legend-card">
        {photoUrl && (
          <div className="legend-image">
            <img
              src={photoUrl}
              alt={legend.name}
              loading="lazy"
            />
          </div>
        )}
        <div className="legend-content">
          <h3>{legend.name}</h3>
          {legend.nickname && <p className="nickname">'{legend.nickname}'</p>}
          <p className="position">{positionLabel}</p>
          <p className="era">{legend.era}</p>
          <div className="stats">
            <div className="stat">
              <span className="value">{legend.appearances}</span>
              <span className="label">Apps</span>
            </div>
            <div className="stat">
              <span className="value">{legend.goals}</span>
              <span className="label">Goals</span>
            </div>
            {legend.nationality && (
              <div className="stat">
                <span className="label">{legend.nationality}</span>
              </div>
            )}
          </div>
        </div>
      </article>
      <style jsx>{`
        .legend-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .legend-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .legend-image {
          width: 100%;
          aspect-ratio: 1;
          background: #f0f0f0;
          overflow: hidden;
        }

        .legend-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .legend-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        h3 {
          margin: 0 0 6px 0;
          font-size: 1.25rem;
          font-weight: bold;
          color: #004687;
        }

        .nickname {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
        }

        .position {
          margin: 0 0 4px 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
        }

        .era {
          margin: 0 0 12px 0;
          font-size: 0.85rem;
          color: #999;
        }

        .stats {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        .stat {
          flex: 1;
          text-align: center;
        }

        .stat .value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #004687;
        }

        .stat .label {
          display: block;
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          h3 {
            font-size: 1.1rem;
          }

          .legend-content {
            padding: 12px;
          }
        }
      `}</style>
    </Link>
  );
}
