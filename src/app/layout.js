import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    metadataBase: new URL('http://localhost:3000'),
    title: 'Radiossa Clothing | متجر ملابس وردي',
    description: 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.',
    openGraph: {
        title: 'Radiossa Clothing',
        description: 'أفضل الملابس العصرية في الجزائر. توصيل سريع لجميع الولايات.',
        images: ['/logo.png'],
    },
};

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
