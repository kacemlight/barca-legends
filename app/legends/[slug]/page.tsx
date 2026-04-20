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
  const legendName = slugToLegendName(slug);

  let legend: Legend | null = null;
  let error: string | null = null;

  try {
    // Try to fetch by path first
    // The path pattern follows AEM's fragment naming convention
    const fragmentPath = `/content/dam/acssandboxemea02jcadev/${slug}`;
    legend = await getLegendByPath(fragmentPath);

    // If not found, fall back to fetching all and filtering by name
    if (!legend) {
      const allLegends = await getAllLegends();
      legend = allLegends.find((l) => legendToSlug(l.name) === slug) || null;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    error = `Failed to load legend: ${errorMessage}`;
    console.error(error);
  }

  // If legend not found, return 404
  if (!legend && !error) {
    notFound();
  }

  return (
    <main className="legend-page">
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

      <style jsx>{`
        main {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .breadcrumb {
          margin-bottom: 30px;
        }

        .breadcrumb a {
          color: #004687;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: opacity 0.3s ease;
        }

        .breadcrumb a:hover {
          opacity: 0.7;
        }

        .error-container {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
        }

        .error-container h1 {
          color: #c33;
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .error-container p {
          color: #666;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          main {
            padding: 20px;
          }

          .breadcrumb {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </main>
  );
}
