'use client';

import React from 'react';

interface TrophyBadgeProps {
  title: string;
  year?: number;
  competition?: string;
}

/**
 * TrophyBadge Component
 * Displays a single trophy as a styled badge
 */
export function TrophyBadge({ title, year, competition }: TrophyBadgeProps) {
  return (
    <div className="trophy-badge">
      <div className="trophy-icon">🏆</div>
      <div className="trophy-info">
        <h4>{title}</h4>
        {year && <p className="year">{year}</p>}
        {competition && <p className="competition">{competition.replace('-', ' ')}</p>}
      </div>
      <style jsx>{`
        .trophy-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          padding: 12px 16px;
          border-radius: 8px;
          margin: 8px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .trophy-icon {
          font-size: 1.5rem;
        }

        .trophy-info {
          flex: 1;
        }

        h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
        }

        p {
          margin: 2px 0 0 0;
          font-size: 0.8rem;
          color: #666;
        }

        .year {
          font-weight: 600;
        }

        .competition {
          text-transform: capitalize;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
