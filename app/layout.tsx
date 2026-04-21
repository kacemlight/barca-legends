import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'FC Barcelona Legends',
  description: 'Discover the greatest players in FC Barcelona history',
  keywords: ['Barcelona', 'Football', 'Legends', 'Players'],
  openGraph: {
    title: 'FC Barcelona Legends',
    description: 'Discover the greatest players in FC Barcelona history',
    url: 'https://www.fcbarcelona.com',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="navbar">
            <div className="nav-container">
              <a href="/" className="logo">
                FC Barcelona Legends
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <div className="footer-content">
            <p>&copy; 2024 FC Barcelona. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
