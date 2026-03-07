"use client";

import { useState, useEffect } from 'react';
import { X, Home, ShoppingBag, Phone, Mail, MapPin, Grid, ChevronRight } from 'lucide-react';
import { client, urlFor } from '@/lib/sanity';

export default function Menu({ isOpen, onClose, onNavigate }) {
    const [categories, setCategories] = useState([]);
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        async function fetchMenuAndCategories() {
            try {
                // Fetch side menu configuration
                const menuQuery = `*[_type == "sideMenu"][0]{
                    menuTitle,
                    collectionsHeading,
                    showCollectionsHeading,
                    collectionsHeadingAlignment,
                    collectionsHeadingStyle,
                    collectionsHeadingColor,
                    showCollections,
                    "collections": collections[]->{
                        _id,
                        name,
                        "slug": slug.current
                    },
                    pagesHeading,
                    showPages,
                    pages[]{
                        title,
                        pageType,
                        url,
                        icon
                    },
                    showFooterInfo,
                    footerText
                }`;
                
                const menuResult = await client.fetch(menuQuery);
                setMenuData(menuResult);

                // Fetch categories for the menu
                const categoriesQuery = `*[_type == "category"] | order(name asc)`;
                const categoriesData = await client.fetch(categoriesQuery);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        }
        
        if (isOpen) {
            fetchMenuAndCategories();
        }
    }, [isOpen]);

    const handleItemClick = (action, data = null) => {
        onClose();
        if (onNavigate) onNavigate(action, data);
    };

    // Get heading style classes
    const getHeadingStyleClasses = (style) => {
        switch (style) {
            case 'bold': return 'font-bold';
            case 'italic': return 'italic';
            case 'bold-italic': return 'font-bold italic';
            default: return 'font-medium';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-start">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Menu Panel - Slides from Left */}
            <div className="relative h-full w-[280px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-left overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-50 flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">
                        {menuData?.menuTitle || 'Menu'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-2">
                    {/* Pages Section */}
                    {menuData?.showPages !== false && menuData?.pages && menuData.pages.length > 0 && (
                        <div className="px-3 space-y-1 mb-6">
                            {menuData.pages.map((page, index) => {
                                const handleClick = () => {
                                    if (page.pageType === 'home') {
                                        handleItemClick('store');
                                    } else if (page.pageType === 'cart') {
                                        handleItemClick('cart');
                                    } else if (page.pageType === 'tracking') {
                                        handleItemClick('tracking');
                                    } else if (page.pageType === 'contact') {
                                        handleItemClick('contact');
                                    } else if (['external', 'whatsapp', 'instagram', 'facebook'].includes(page.pageType)) {
                                        window.open(page.url, '_blank');
                                    }
                                };

                                return (
                                    <button
                                        key={index}
                                        onClick={handleClick}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                                    >
                                        {page.icon && (
                                            <img
                                                src={urlFor(page.icon).width(18).url()}
                                                alt={page.title}
                                                className="w-[18px] h-[18px] object-contain"
                                            />
                                        )}
                                        <span>{page.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Categories Section */}
                    {menuData?.showCollections !== false && (
                        <>
                            {menuData?.showCollectionsHeading && (
                                <div 
                                    className="px-5 mb-3"
                                    style={{ 
                                        textAlign: menuData.collectionsHeadingAlignment || 'left',
                                        color: menuData.collectionsHeadingColor || '#000000'
                                    }}
                                >
                                    <h3 
                                        className={`text-[10px] uppercase tracking-[2px] ${getHeadingStyleClasses(menuData.collectionsHeadingStyle)}`}
                                        style={{ color: menuData.collectionsHeadingColor || '#000000' }}
                                    >
                                        {menuData.collectionsHeading || 'MÉTAVERS DES COLLECTIONS'}
                                    </h3>
                                </div>
                            )}

                            <div className="px-3 space-y-1">
                                {(menuData?.collections && menuData.collections.length > 0 ? menuData.collections : categories).map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() => handleItemClick('category', { id: category._id, name: category.name })}
                                        className="w-full flex items-center justify-between px-3 py-4 rounded-xl hover:bg-primary/5 group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Grid size={16} />
                                            </div>
                                            <span className="font-semibold text-gray-800 group-hover:text-primary">{category.name}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                    </button>
                                ))}

                                {categories.length === 0 && (!menuData?.collections || menuData.collections.length === 0) && (
                                    <p className="px-3 py-4 text-sm text-gray-400 italic font-medium">
                                        Aucune collection trouvée
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {menuData?.showFooterInfo !== false && (
                    <div className="p-5 border-t border-gray-50 bg-gray-50/50 flex-shrink-0">
                        {menuData?.footerText && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                {menuData.footerText}
                            </p>
                        )}
                        <div className="space-y-3">
                            <a href="tel:+213555555555" className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-primary transition-colors">
                                <Phone size={14} />
                                <span>05 55 55 55 55</span>
                            </a>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <MapPin size={14} />
                                <span>Alger, Algérie</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}