import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { client } from '@/lib/sanity';

const inter = Inter({ subsets: ['latin'] });

// Fetch metadata at build time
export async function generateMetadata() {
  try {
    const settings = await client.fetch(`*[_type == "settings"][0]{
      previewTitle,
      previewDescription,
      siteName
    }`);

    const title = settings?.previewTitle || 'Radiossa Clothing | عنوان الفخامة';
    const description = settings?.previewDescription || 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.';
    const siteName = settings?.siteName || 'عنوان الفخامة';

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName,
        images: ['/og-image.png'], // This will use our static fallback route
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
      },
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      title: 'Radiossa Clothing | الفخامة',
      description: 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.',
      openGraph: {
        title: 'الفخامة',
        description: 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.',
        images: ['/og-image.png'],
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="ltr">
      <body className={inter.className}>
        <CartProvider>
    {children}
</CartProvider>
      </body>
    </html>
  );
}
