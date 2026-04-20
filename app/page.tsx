import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroSection } from '@/components/HeroSection';
import { LegendCard } from '@/components/LegendCard';
import { getAllLegends, getPageConfig } from '@/lib/aem';
import { Legend, PageConfig } from '@/types';

export const metadata: Metadata = {
  title: 'Barça Legends | FC Barcelona',
  description: 'Discover the greatest players in FC Barcelona history',
};

/**
 * Home Page - Legends Listing
 * Fetches all legends and page config from live AEM instance
 */
export default async function HomePage() {
  let legends: Legend[] = [];
  let pageConfig: PageConfig | null = null;
  let legendsError: string | null = null;
  let configError: string | null = null;

  // Fetch all legends from AEM
  try {
    legends = await getAllLegends();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    legendsError = `Failed to load legends: ${errorMessage}`;
    console.error(legendsError);
  }

  // Fetch page configuration from AEM
  try {
    pageConfig = await getPageConfig();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    configError = `Failed to load page config: ${errorMessage}`;
    console.error(configError);
  }

  return (
    <main>
      {/* Hero Section with Page Config */}
      <HeroSection config={pageConfig} error={configError} />

      {/* Legends Grid */}
      <section className="legends-section">
        <div className="container">
          {legendsError ? (
            <div className="error-message">
              <p>⚠️ {legendsError}</p>
            </div>
          ) : legends.length === 0 ? (
            <div className="empty-state">
              <p>No legends found. Please check your AEM configuration.</p>
            </div>
          ) : (
            <>
              <h2>Our Legends</h2>
              <div className="legends-grid">
                {legends.map((legend) => (
                  <LegendCard key={legend._path || legend.name} legend={legend} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        main {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .legends-section {
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          font-size: 2rem;
          font-weight: bold;
          color: #004687;
          margin-bottom: 30px;
          text-align: center;
        }

        .legends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .error-message {
          background: #fee;
          border: 1px solid #f99;
          border-radius: 8px;
          padding: 16px;
          color: #c33;
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #999;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          h2 {
            font-size: 1.5rem;
          }

          .legends-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </main>
  );
}
