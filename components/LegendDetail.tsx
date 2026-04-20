'use client';

import React from 'react';
import { Legend } from '@/types';
import { TrophyBadge } from './TrophyBadge';

interface LegendDetailProps {
  legend: Legend | null;
  error?: string | null;
}

/**
 * LegendDetail Component
 * Displays full player biography and achievements
 */
export function LegendDetail({ legend, error = null }: LegendDetailProps) {
  if (error) {
    return (
      <div className="legend-detail error">
        <p>Error loading legend details: {error}</p>
      </div>
    );
  }

  if (!legend) {
    return (
      <div className="legend-detail empty">
        <p>Legend not found</p>
      </div>
    );
  }

  const positionLabel = legend.position
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const photoUrl = legend.photo?._publishUrl || legend.photo?._path;

  return (
    <article className="legend-detail">
      <div className="detail-container">
        {photoUrl && (
          <div className="detail-image">
            <img
              src={photoUrl}
              alt={legend.name}
            />
          </div>
        )}
        <div className="legend-info">
          <h1>{legend.name}</h1>
          {legend.nickname && <p className="nickname">'{legend.nickname}'</p>}
          <p className="position">{positionLabel}</p>
          <p className="era">Era: {legend.era}</p>
          <p className="nationality">Nationality: {legend.nationality}</p>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-value">{legend.appearances}</span>
              <span className="stat-label">Appearances</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{legend.goals}</span>
              <span className="stat-label">Goals</span>
            </div>
          </div>

          <div className="bio-section">
            <h2>Biography</h2>
            <p className="bio-text">{legend.bio}</p>
          </div>

          {legend.trophies && legend.trophies.length > 0 && (
            <div className="trophies-section">
              <h2>Trophies</h2>
              <div className="trophies-list">
                {legend.trophies.map((trophy, index) => (
                  <TrophyBadge key={index} title={trophy} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .legend-detail {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .detail-image {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .legend-info {
          padding: 20px 0;
        }

        h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
          color: #004687;
          font-weight: bold;
        }

        .nickname {
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          color: #666;
          font-style: italic;
        }

        .position {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .era,
        .nationality {
          margin: 5px 0;
          font-size: 0.95rem;
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 25px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .stat-box {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #004687;
          margin-bottom: 5px;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: #999;
          text-transform: uppercase;
        }

        .bio-section {
          margin: 30px 0;
        }

        .bio-section h2 {
          font-size: 1.5rem;
          margin: 0 0 15px 0;
          color: #004687;
        }

        .bio-text {
          line-height: 1.8;
          color: #555;
          margin: 0;
        }

        .trophies-section {
          margin-top: 30px;
        }

        .trophies-section h2 {
          font-size: 1.5rem;
          margin: 0 0 15px 0;
          color: #004687;
        }

        .trophies-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .error,
        .empty {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .detail-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          h1 {
            font-size: 1.8rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}
