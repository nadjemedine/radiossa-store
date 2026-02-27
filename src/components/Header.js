"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { client } from '@/lib/sanity';
import { useCart } from '@/lib/cart-context';

export default function Header({ onCartClick, onMenuClick }) {
    const [settings, setSettings] = useState({
        useLocalLogo: true,
        localLogoPath: '/logo.svg',
        logoWidth: 250,
        logoHeight: 100,
        logoMaxHeight: 120,
        logoColorFilter: '',
        logoBackgroundColor: '',
        logoPadding: 0,
        logoBorderRadius: 0,
        logoAlignment: 'center',
        logoMarginTop: 0
    });
    const { cartCount } = useCart();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const data = await client.fetch(`*[_type == "settings"][0]{
                    useLocalLogo,
                    localLogoPath,
                    logoWidth,
                    logoHeight,
                    logoMaxHeight,
                    logoColorFilter,
                    logoBackgroundColor,
                    logoPadding,
                    logoBorderRadius,
                    logoAlignment,
                    logoMarginTop
                }`);
                
                if (data) {
                    setSettings(prev => ({
                        ...prev,
                        ...data,
                        // Use defaults for any missing values
                        localLogoPath: data.localLogoPath || '/logo.svg',
                        logoWidth: data.logoWidth || 250,
                        logoHeight: data.logoHeight || 100,
                        logoMaxHeight: data.logoMaxHeight || 120,
                        logoAlignment: data.logoAlignment || 'center'
                    }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <>
            {/* Top Bar Banner */}
            <div className="bg-white text-primary text-[10px] py-2 px-4 text-center font-bold tracking-wider border-b border-gray-50">
                Bienvenue a Radiossa Shop livraison 58 willaya
            </div>

            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-6">
                <div className="max-w-md mx-auto flex justify-between items-center relative">
                    {/* Left Icons (Search & Menu) */}
                    <div className="flex-1 flex justify-start items-center gap-3">
                        <button className="p-1">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button onClick={onMenuClick} className="p-1">
                            <Menu size={22} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Logo Container - Configurable Positioning */}
                    <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-full px-16 flex justify-${settings.logoAlignment}`}
                        style={{ marginTop: `${settings.logoMarginTop}px` }}
                    >
                        <div 
                            className="max-w-full"
                            style={{
                                padding: `${settings.logoPadding}px`,
                                backgroundColor: settings.logoBackgroundColor,
                                borderRadius: `${settings.logoBorderRadius}px`,
                            }}
                        >
                            <Image
                                src={settings.localLogoPath}
                                alt="Store Logo"
                                width={settings.logoWidth}
                                height={settings.logoHeight}
                                className="w-auto object-contain"
                                style={{
                                    maxHeight: `${settings.logoMaxHeight}px`,
                                    filter: settings.logoColorFilter
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Icon (Bag) */}
                    <div className="flex-1 flex justify-end gap-2 items-center text-gray-800">
                        <button onClick={onCartClick} className="p-1 relative">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}



