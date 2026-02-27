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

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    client.fetch(`*[_type == "product"] | order(_createdAt desc)`),
                    client.fetch(`*[_type == "category"]`)
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const filteredProducts = selectedCategoryId === 'all'
        ? products
        : products.filter(product => product.category._ref === selectedCategoryId);

    const activeCategoryTitle = selectedCategoryId === 'all'
        ? "NOUVEAUTÉS"
        : categories.find(c => c._id === selectedCategoryId)?.title || "PRODUITS";

    return (
        <div 
            className="max-w-md mx-auto min-h-screen bg-background relative overflow-x-hidden"
        >
            {/* Background overlay for better content readability */}
            <div className="absolute inset-0 bg-white/80"></div>
            
            <div className="relative z-10">
                <Header
                    onCartClick={() => setActiveTab('cart')}
                    onMenuClick={() => console.log('Menu clicked')}
                />

                <main className="px-4 pb-20">
                    {activeTab === 'store' ? (
                        <div>
                            {/* Categories */}
                            <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
                                <button
                                    onClick={() => setSelectedCategoryId('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                        selectedCategoryId === 'all'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    TOUT
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category._id}
                                        onClick={() => setSelectedCategoryId(category._id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                            selectedCategoryId === category._id
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onClick={() => setSelectedProduct(product)}
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center text-gray-400 py-10 font-medium">
                                        Aucun produit dans cette catégorie
                                    </p>
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
        </div>
    );
}