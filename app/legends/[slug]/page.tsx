import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllLegends, getLegendByPath, legendToSlug, slugToLegendName } from '@/lib/aem';
import { LegendDetail } from '@/components/LegendDetail';
import { Legend } from '@/types';

interface LegendDetailPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate static paths for all legend detail pages
 * This runs at build time to pre-render all legend pages
 */
export async function generateStaticParams() {
  try {
    const legends = await getAllLegends();
    return legends.map((legend) => ({
      slug: legendToSlug(legend.name),
    }));
  } catch (error) {
    console.error('Failed to generate static params for legends:', error);
    return [];
  }
}

/**
 * Generate metadata for each legend page
 */
export async function generateMetadata({ params }: LegendDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const legendName = slugToLegendName(slug);

  return {
    title: `${legendName} | Barça Legends`,
    description: `Learn about ${legendName}, a legendary FC Barcelona player.`,
  };
}

/**
 * Legend Detail Page
 * Displays full information about a single legend
 */
export default async function LegendDetailPage({ params }: LegendDetailPageProps) {
  const { slug } = params;

  let legend: Legend | null = null;
  let error: string | null = null;

  try {
    const fragmentPath = `/content/dam/acssandboxemea02jcadev/${slug}`;
    legend = await getLegendByPath(fragmentPath);

    if (!legend) {
      const allLegends = await getAllLegends();
      legend = allLegends.find((l) => legendToSlug(l.name) === slug) || null;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    error = `Failed to load legend: ${errorMessage}`;
    console.error(error);
  }

  if (!legend && !error) {
    notFound();
  }

  return (
    <div className="legend-page">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">← Back to Legends</Link>
        </div>

        {error ? (
          <div className="error-container">
            <h1>Error</h1>
            <p>{error}</p>
          </div>
        ) : (
          <LegendDetail legend={legend} />
        )}
      </div>
    </div>
  );
}
