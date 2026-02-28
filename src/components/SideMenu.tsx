'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Grid } from 'lucide-react';
import { client, urlFor } from '@/lib/sanity';

interface Category {
    _id: string;
    title: string;
    name: string;
    slug: string;
    icon?: any;
}

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onCategorySelect?: (category: { id: string; name: string }) => void;
}

export default function SideMenu({ isOpen, onClose, onCategorySelect }: SideMenuProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const query = `*[_type == "category"] | order(_createdAt asc)[0...3] {
          _id,
          name,
          "title": name,
          "slug": slug.current,
          icon
        }`;
                const data = await client.fetch(query);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (isOpen) {
            fetchCategories();
            // Prevent scrolling when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
                        <span className="text-xl font-bold tracking-tight text-gray-900">Menu</span>
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
                        <div className="px-6 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-primary">Achats par collection</h3>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <ul className="space-y-1">
                                {categories.map((category) => (
                                    <li key={category._id}>
                                        <button
                                            onClick={() => {
                                                if (onCategorySelect) {
                                                    onCategorySelect({ id: category._id, name: category.name });
                                                }
                                                onClose();
                                            }}
                                            className="w-full flex items-center justify-between px-6 py-4 text-gray-700 font-medium transition-all group hover:bg-gray-50 hover:text-[#d4af37]"
                                        >
                                            <div className="flex items-center gap-3">
                                                {category.icon?.asset ? (
                                                    <img
                                                        src={urlFor(category.icon).url()}
                                                        alt=""
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                ) : (
                                                    <Grid size={20} className="text-gray-400 group-hover:text-[#d4af37]" />
                                                )}
                                                <span className="font-semibold">{category.title}</span>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#d4af37]"
                                            />
                                        </button>
                                    </li>
                                ))}
                                {categories.length === 0 && (
                                    <p className="px-6 text-sm text-gray-400 italic">No categories found</p>
                                )}
                            </ul>
                        )}
                    </nav>

                    {/* Footer Info */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="space-y-4 text-sm text-gray-600">
                            <button
                                onClick={() => {
                                    if (onCategorySelect) onCategorySelect(null);
                                    onClose();
                                }}
                                className="block font-semibold text-gray-900 border-b border-transparent hover:border-[#d4af37] w-fit"
                            >
                                Accueil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

