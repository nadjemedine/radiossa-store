"use client";

import { useState, useEffect } from 'react';
import { X, Home, ShoppingBag, Phone, Mail, MapPin, Grid, ChevronRight } from 'lucide-react';
import { client } from '@/lib/sanity';

export default function Menu({ isOpen, onClose, onNavigate }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await client.fetch(`*[_type == "category"] | order(name asc)`);
                setCategories(data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleItemClick = (action, data = null) => {
        onClose();
        if (onNavigate) onNavigate(action, data);
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
                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-2">
                    {/* Basic Links */}
                    <div className="px-3 space-y-1 mb-6">
                        <button
                            onClick={() => handleItemClick('store')}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                        >
                            <Home size={18} className="text-primary" />
                            <span>Accueil</span>
                        </button>
                    </div>

                    {/* Categories Section */}
                    <div className="px-5 mb-3">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">MÉTAVERS DES COLLECTIONS</h3>
                    </div>

                    <div className="px-3 space-y-1">
                        {categories.map((category) => (
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

                        {categories.length === 0 && (
                            <p className="px-3 py-4 text-sm text-gray-400 italic font-medium">
                                Aucune collection trouvée
                            </p>
                        )}
                    </div>
                </div>

                {/* Simple Footer */}
                <div className="p-5 border-t border-gray-50 bg-gray-50/50 flex-shrink-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
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