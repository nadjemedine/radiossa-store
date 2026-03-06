"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
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

                // Fetch menu configuration and categories
                const [menuData, allCategories] = await Promise.all([
                    client.fetch(`*[_type == "sideMenu"][0]{
                        showCollections,
                        collectionsHeading,
                        showCollectionsHeading,
                        collectionsHeadingAlignment,
                        collectionsHeadingStyle,
                        collectionsHeadingColor,
                        "collections": collections[]->{_id, name, "title": name, "slug": slug.current, icon}
                    }`),
                    client.fetch(`*[_type == "category"] | order(_createdAt asc) {
                        _id,
                        name,
                        "title": name,
                        "slug": slug.current,
                        icon
                    }`)
                ]);

                // Store menu settings for heading display
                if (menuData) {
                    setSettings(prev => ({
                        ...prev,
                        collectionsHeading: menuData.collectionsHeading || 'Achats par collection',
                        showCollectionsHeading: menuData.showCollectionsHeading !== false,
                        collectionsHeadingAlignment: menuData.collectionsHeadingAlignment || 'left',
                        collectionsHeadingStyle: menuData.collectionsHeadingStyle || 'bold-italic',
                        collectionsHeadingColor: menuData.collectionsHeadingColor || '#000000',
                    }));
                }

                // Determine which categories to display
                if (menuData?.showCollections !== false) {
                    if (menuData?.collections && menuData.collections.length > 0) {
                        setCategories(menuData.collections);
                    } else {
                        setCategories(allCategories || []);
                    }
                } else {
                    setCategories([]);
                }
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
                <div className="animate-marquee whitespace-nowrap min-now-full">
                    Bienvenue à Radiossa Shop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Livraison 58 Wilayas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paiement à la livraison &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bienvenue à Radiossa Shop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Livraison 58 Wilayas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paiement à la livraison &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex flex-col">
                {/* Main Header Row */}
                <div className="px-4 py-5 flex justify-between items-center relative max-w-6xl mx-auto w-full">
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

                {/* Categories Bar (The Menu Bar) - Responsive */}
                {categories.length > 0 && activeTab !== 'cart' && (
                    <div className="flex flex-col bg-white border-t border-gray-50/50 w-full">
                        {/* Collections Section Heading */}
                        {(settings.showCollectionsHeading !== false && settings.collectionsHeading) && (
                            <div className="px-4 pt-3 pb-1"
                                style={{
                                    textAlign: settings.collectionsHeadingAlignment || 'left'
                                }}
                            >
                                <h3
                                    className={`text-[10px] uppercase tracking-widest ${settings.collectionsHeadingStyle === 'bold' ? 'font-bold' :
                                        settings.collectionsHeadingStyle === 'italic' ? 'italic font-medium' :
                                            settings.collectionsHeadingStyle === 'bold-italic' ? 'font-bold italic' :
                                                'font-medium'
                                        }`}
                                    style={{
                                        color: settings.collectionsHeadingColor || '#666'
                                    }}
                                >
                                    {settings.collectionsHeading}
                                </h3>
                            </div>
                        )}

                        {/* Scrollable Categories Container */}
                        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar bg-white">
                            <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:py-3 min-w-max">
                                {/* "All" Category */}
                                <button
                                    onClick={() => {
                                        if (typeof onCategorySelect === 'function') {
                                            onCategorySelect(null);
                                        }
                                    }}
                                    className={`flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-shrink-0 ${!activeCategoryId
                                        ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    Tout
                                </button>

                                {/* Dynamic Categories from Schema */}
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() => {
                                            if (typeof onCategorySelect === 'function') {
                                                onCategorySelect({ id: category._id, name: category.name });
                                            }
                                        }}
                                        className={`flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-shrink-0 ${activeCategoryId === category._id
                                            ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category.icon?.asset && (
                                            <img
                                                src={urlFor(category.icon).url()}
                                                alt=""
                                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain ${activeCategoryId === category._id ? 'brightness-0 invert' : ''}`}
                                            />
                                        )}
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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



