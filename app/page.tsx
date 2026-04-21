import React from 'react';
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

  try {
    legends = await getAllLegends();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    legendsError = `Failed to load legends: ${errorMessage}`;
    console.error(legendsError);
  }

  try {
    pageConfig = await getPageConfig();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    configError = `Failed to load page config: ${errorMessage}`;
    console.error(configError);
  }

  return (
    <div className="home-main">
      <HeroSection config={pageConfig} error={configError} />

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
    </div>
  );
}
