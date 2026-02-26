"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import CheckoutForm from '@/components/CheckoutForm';
import ProductDetails from '@/components/ProductDetails';
import Footer from '@/components/Footer';
import PreFooter from '@/components/PreFooter';
import LineSeparator from '@/components/LineSeparator';
import { client } from '@/lib/sanity';
import { X, ChevronRight } from 'lucide-react';

export default function Home() {
    const [activeTab, setActiveTab] = useState('store');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch categories
                const catQuery = `*[_type == "category"] { _id, title, "slug": slug.current }`;
                const catData = await client.fetch(catQuery);
                setCategories(catData);

                // Fetch products with category reference
                const prodQuery = `*[_type == "product"] | order(_createdAt desc) {
                    _id,
                    name,
                    price,
                    comparePrice,
                    image,
                    description,
                    slug,
                    colors,
                    sizes,
                    "categoryId": category._ref
                }`;
                const prodData = await client.fetch(prodQuery);
                setProducts(prodData);
            } catch (error) {
                console.error("Sanity fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredProducts = selectedCategoryId === 'all'
        ? products
        : products.filter(p => p.categoryId === selectedCategoryId);

    const activeCategoryTitle = selectedCategoryId === 'all'
        ? "NOUVEAUTÉS"
        : categories.find(c => c._id === selectedCategoryId)?.title || "PRODUITS";

    return (
        <div className="max-w-md mx-auto min-h-screen bg-background relative overflow-x-hidden">
            <Header
                onCartClick={() => setActiveTab('cart')}
                onMenuClick={() => setIsMenuOpen(true)}
            />

            {/* Menu Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Sidebar Drawer */}
            <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase">Collections</h2>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto">
                        <button
                            onClick={() => {
                                setSelectedCategoryId('all');
                                setIsMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedCategoryId === 'all' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <span className="font-bold text-sm uppercase tracking-wider">Tout Voir</span>
                            <ChevronRight size={18} />
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat._id}
                                onClick={() => {
                                    setSelectedCategoryId(cat._id);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedCategoryId === cat._id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="font-bold text-sm uppercase tracking-wider">{cat.title}</span>
                                <ChevronRight size={18} />
                            </button>
                        ))}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Radiossa Clothing © 2026</p>
                    </div>
                </div>
            </div>

            <main className="px-4 py-6 mb-10">
                {activeTab === 'store' ? (
                    <div>
                        {/* Categories Bar (Quick Select) */}
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
                            <button
                                onClick={() => setSelectedCategoryId('all')}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategoryId === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-100'}`}
                            >
                                TOUT
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategoryId(cat._id)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategoryId === cat._id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-100'}`}
                                >
                                    {cat.title.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase text-center">{activeCategoryTitle}</h1>
                            <div className="w-12 h-[1px] bg-primary mt-2"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-48 animate-pulse" />
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onClick={() => setSelectedProduct(product)}
                                    />
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-gray-400 py-10 font-medium">Aucun produit في هذه المجموعة</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <CheckoutForm />
                )}
            </main>

            {/* Product Details Modal */}
            {selectedProduct && (
                <ProductDetails
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onNavigate={(p) => setSelectedProduct(p)}
                />
            )}

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <PreFooter />
            <LineSeparator />
            <Footer />
        </div>
    );
}
