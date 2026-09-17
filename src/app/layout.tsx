import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATS Resume Studio — Editorial, ATS-Conscious Resume Builder',
  description:
    'Turn the resume you already have into a beautiful, ATS-conscious application-ready resume. 12 editorial templates, vector PDF & true Word docx exports.',
  keywords: [
    'ATS resume',
    'resume generator',
    'AI resume parser',
    'ATS friendly templates',
    'editorial resume',
    'resume builder',
    'docx resume export',
  ],
  authors: [{ name: 'ATS Resume Studio' }],
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen selection:bg-stone-200 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
