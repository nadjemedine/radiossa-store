"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import CheckoutForm from '@/components/CheckoutForm';
import ProductDetails from '@/components/ProductDetails';
import { client } from '@/lib/sanity';

export default function Home() {
    const [activeTab, setActiveTab] = useState('store');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                // استخدام GROQ لجلب المنتجات مرتبة من الأحدث للأقدم
                const query = `*[_type == "product"] | order(_createdAt desc) {
                    _id,
                    name,
                    price,
                    image,
                    description,
                    slug,
                    colors,
                    sizes
                }`;
                const data = await client.fetch(query);
                setProducts(data);
            } catch (error) {
                console.error("Sanity fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="max-w-md mx-auto min-h-screen bg-background">
            <Header onCartClick={() => setActiveTab('cart')} />

            <main className="px-4 py-6 mb-10">
                {activeTab === 'store' ? (
                    <div>
                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">NOUVEAUTÉS</h1>
                            <div className="w-12 h-[1px] bg-primary mt-2"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-48 animate-pulse" />
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onClick={() => setSelectedProduct(product)}
                                    />
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-gray-400 py-10">Aucun produit disponible pour le moment</p>
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
                />
            )}

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
