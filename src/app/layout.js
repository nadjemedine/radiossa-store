import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { client } from '@/lib/sanity';
import ProtectionLayer from '@/components/ProtectionLayer';


// Fetch metadata at build time
export async function generateMetadata() {
  try {
    const settings = await client.fetch(`*[_type == "settings"][0]{
      previewTitle,
      previewDescription,
      siteName
    }`);

    const title = settings?.previewTitle || 'Radiossa Clothing | Le luxe à votre portée';
    const description = settings?.previewDescription || 'La meilleure mode contemporaine en Algérie. Livraison rapide dans 58 Wilayas.';
    const siteName = settings?.siteName || 'Radiossa Clothing';

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      title,
      description,
      openGraph: {
        title,
        description,
        siteName,
        images: ['/og-image.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
      },
      icons: {
        icon: '/favicon.svg',
      },
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      title: 'Radiossa Clothing | Élégance & Style',
      description: 'Découvrez notre collection exclusive. Livraison disponible dans 58 Wilayas.',
      openGraph: {
        title: 'Radiossa Clothing',
        description: 'La meilleure mode contemporaine en Algérie.',
        images: ['/og-image.png'],
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body className="font-sans">
        <CartProvider>
          <ProtectionLayer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
