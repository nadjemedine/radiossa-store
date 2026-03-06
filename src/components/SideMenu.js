'use client';

import React, { useEffect, useState } from 'react';
import { X, ChevronRight, Grid, Home, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react';
import { client, urlFor } from '@/lib/sanity';

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} title
 * @property {string} name
 * @property {string} slug
 * @property {any} [icon]
 */

/**
 * @typedef {Object} MenuPage
 * @property {string} _key
 * @property {string} title
 * @property {string} pageType
 * @property {string} [url]
 * @property {any} [icon]
 */

/**
 * @typedef {Object} MenuSettings
 * @property {string} [menuTitle]
 * @property {string} [collectionsHeading]
 * @property {boolean} [showCollections]
 * @property {Category[]} [collections]
 * @property {string} [pagesHeading]
 * @property {boolean} [showPages]
 * @property {MenuPage[]} [pages]
 * @property {boolean} [showFooterInfo]
 * @property {string} [footerText]
 */

/**
 * @typedef {Object} SideMenuProps
 * @property {boolean} isOpen
 * @property {Function} onClose
 * @property {Function} [onCategorySelect]
 * @property {Function} [onCartClick]
 * @property {Function} [onNavigateToPage]
 */

const pageIcons = {
    home: <Home size={20} />,
    cart: <ShoppingBag size={20} />,
    external: <ExternalLink size={20} />,
    whatsapp: <MessageCircle size={20} />,
    instagram: <ExternalLink size={20} />,
    facebook: <ExternalLink size={20} />,
};

export default function SideMenu({ isOpen, onClose, onCategorySelect, onCartClick, onNavigateToPage }) {
    const [categories, setCategories] = useState([]);
    const [menuSettings, setMenuSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMenuData() {
            try {
                const [menuData, allCategories] = await Promise.all([
                    client.fetch(`*[_type == "sideMenu"][0]{
                        menuTitle,
                        collectionsHeading,
                        showCollectionsHeading,
                        collectionsHeadingAlignment,
                        collectionsHeadingStyle,
                        collectionsHeadingColor,
                        showCollections,
                        "collections": collections[]->{_id, name, "title": name, "slug": slug.current, icon},
                        pagesHeading,
                        showPages,
                        pages,
                        showFooterInfo,
                        footerText
                    }`),
                    client.fetch(`*[_type == "category"] | order(_createdAt asc) {
                        _id,
                        name,
                        "title": name,
                        "slug": slug.current,
                        icon
                    }`)
                ]);

                setMenuSettings(menuData);

                // Use collections from menu settings if specified, otherwise use all categories
                if (menuData?.collections && menuData.collections.length > 0) {
                    setCategories(menuData.collections);
                } else {
                    setCategories(allCategories || []);
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (isOpen) {
            fetchMenuData();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handlePageClick = (page) => {
        switch (page.pageType) {
            case 'home':
                if (onCategorySelect) onCategorySelect(null);
                onClose();
                break;
            case 'cart':
                if (onCartClick) onCartClick();
                onClose();
                break;
            case 'tracking':
                // Navigate to the tracking page
                if (onNavigateToPage) {
                    onNavigateToPage('tracking');
                } else {
                    // Fallback to direct navigation
                    window.location.href = '/suivi-commande';
                }
                onClose();
                break;
            case 'contact':
                // Navigate to the contact page
                if (onNavigateToPage) {
                    onNavigateToPage('contact');
                } else {
                    // Fallback to direct navigation
                    window.location.href = '/contact';
                }
                onClose();
                break;
            case 'external':
            case 'whatsapp':
            case 'instagram':
            case 'facebook':
                if (page.url) window.open(page.url, '_blank');
                onClose();
                break;
            default:
                onClose();
        }
    };

    const showCollections = menuSettings?.showCollections !== false;
    const showPages = menuSettings?.showPages !== false;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            {menuSettings?.menuTitle || 'Menu'}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-100 rounded-full"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <nav className="flex-1 overflow-y-auto py-6">
                        {/* Default Home link at the top */}
                        <ul className="space-y-1 px-6 mb-4">
                            <li>
                                <button
                                    onClick={() => {
                                        if (onCategorySelect) onCategorySelect(null);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between px-6 py-4 text-gray-900 font-medium transition-all group hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Home size={20} className="text-gray-400" />
                                        <span className="font-semibold">Accueil</span>
                                    </div>
                                </button>
                            </li>
                        </ul>

                        {/* Collections Section */}
                        {showCollections && (
                            <>
                                {(menuSettings?.showCollectionsHeading !== false && (menuSettings?.collectionsHeading || 'Achats par collection')) && (
                                    <div className="px-6 mt-4 mb-2"
                                        style={{
                                            textAlign: menuSettings?.collectionsHeadingAlignment || 'left'
                                        }}
                                    >
                                        <h3
                                            className={`text-xs uppercase tracking-widest ${menuSettings?.collectionsHeadingStyle === 'bold' ? 'font-bold text-gray-900' :
                                                menuSettings?.collectionsHeadingStyle === 'italic' ? 'italic font-semibold text-gray-500' :
                                                    menuSettings?.collectionsHeadingStyle === 'bold-italic' ? 'font-bold italic text-gray-900' :
                                                        'font-semibold text-gray-400'
                                                }`}
                                            style={{
                                                color: menuSettings?.collectionsHeadingColor
                                            }}
                                        >
                                            {menuSettings?.collectionsHeading || 'Achats par collection'}
                                        </h3>
                                    </div>
                                )}
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <ul className="space-y-1 px-6">
                                        {categories.map((category) => (
                                            <li key={category._id}>
                                                <button
                                                    onClick={() => {
                                                        if (onCategorySelect) {
                                                            onCategorySelect({ id: category._id, name: category.name });
                                                        }
                                                        onClose();
                                                    }}
                                                    className="w-full flex items-center justify-between px-6 py-4 text-gray-900 font-medium transition-all group hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {category.icon?.asset ? (
                                                            <img
                                                                src={urlFor(category.icon).url()}
                                                                alt=""
                                                                className="w-6 h-6 object-contain"
                                                            />
                                                        ) : (
                                                            <Grid size={20} className="text-gray-400" />
                                                        )}
                                                        <span className="font-semibold">{category.title}</span>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="px-6 text-sm text-gray-400 italic">No categories found</p>
                                        )}
                                    </ul>
                                )}
                            </>
                        )}

                        {/* Pages Section */}
                        {showPages && menuSettings?.pages && menuSettings.pages.length > 0 && (
                            <>
                                <div className="px-6 mt-8 mb-4">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-gray-900">
                                        {menuSettings?.pagesHeading || 'Pages'}
                                    </h3>
                                </div>

                                <ul className="space-y-1 px-6">
                                    {menuSettings.pages.map((page) => (
                                        <li key={page._key}>
                                            <button
                                                onClick={() => handlePageClick(page)}
                                                className="w-full flex items-center justify-between px-6 py-4 text-gray-900 font-medium transition-all group hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {page.icon?.asset ? (
                                                        <img
                                                            src={urlFor(page.icon).url()}
                                                            alt=""
                                                            className="w-6 h-6 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            {pageIcons[page.pageType] || <ExternalLink size={20} />}
                                                        </span>
                                                    )}
                                                    <span className="font-semibold">{page.title}</span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </nav>

                    {/* Footer Info */}
                    {(menuSettings?.showFooterInfo !== false) && (
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <div className="space-y-4 text-sm text-gray-600">
                                {menuSettings?.footerText && (
                                    <p className="text-xs text-gray-400">{menuSettings.footerText}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
