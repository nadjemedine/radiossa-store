"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { client } from '@/lib/sanity';
import { useCart } from '@/lib/cart-context';

export default function Header({ activeTab, onCartClick, onMenuClick, onLogoClick, onSearchClick, onCategorySelect, activeCategoryId }) {
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
    const [categories, setCategories] = useState([]);
    const { cartCount } = useCart();

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch settings
                const settingsData = await client.fetch(`*[_type == "settings"][0]{
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

                if (settingsData) {
                    setSettings(prev => ({
                        ...prev,
                        ...settingsData,
                        localLogoPath: settingsData.localLogoPath || '/logo.svg',
                        logoWidth: settingsData.logoWidth || 250,
                        logoHeight: settingsData.logoHeight || 100,
                        logoMaxHeight: settingsData.logoMaxHeight || 120,
                        logoAlignment: settingsData.logoAlignment || 'center'
                    }));
                }

                // Fetch top 3 categories
                const categoriesData = await client.fetch(`*[_type == "category"] | order(_createdAt asc)[0...3]`);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const handleSearchClick = () => {
        if (typeof onSearchClick === 'function') {
            onSearchClick();
        }
    };

    return (
        <>
            {/* Top Bar Banner with Marquee Animation */}
            <div className="bg-white text-primary text-[12px] py-2 border-b border-gray-50 uppercase font-bold italic tracking-wider relative overflow-hidden h-[30px] flex items-center">
                <div className="animate-marquee whitespace-nowrap min-w-full">
                    Bienvenue a Radiossa Shop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Livraison 58 Wilaya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paiement à la livraison &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bienvenue a Radiossa Shop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Livraison 58 Wilaya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paiement à la livraison &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex flex-col">
                {/* Main Header Row */}
                <div className="px-4 py-5 flex justify-between items-center relative max-w-md mx-auto w-full">
                    {/* Left Icon (Menu Toggle) */}
                    <div className="flex-1 flex justify-start items-center">
                        <button onClick={onMenuClick} className="p-1 -ml-1 hover:bg-gray-50 rounded-full transition-colors duration-200">
                            <Menu size={22} strokeWidth={1.2} />
                        </button>
                    </div>

                    {/* Logo Container - Configurable Positioning */}
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 flex justify-${settings.logoAlignment}`}
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
                            <button onClick={() => {
                                if (typeof onLogoClick === 'function') {
                                    onLogoClick();
                                }
                            }} className="cursor-pointer">
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
                                    priority={true}
                                    quality={75}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Right Icons (Search & Bag) */}
                    <div className="flex-1 flex justify-end gap-3 items-center">
                        <button onClick={handleSearchClick} className="p-1 hover:bg-gray-50 rounded-full transition-colors duration-200">
                            <Search size={22} strokeWidth={1.2} />
                        </button>
                        <button onClick={onCartClick} className="p-1 relative hover:bg-gray-50 rounded-full transition-colors duration-200">
                            <ShoppingBag size={22} strokeWidth={1.2} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Categories Bar (The Menu Bar) */}
            </header>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}



