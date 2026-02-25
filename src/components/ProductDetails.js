"use client";

import { useCart } from '@/lib/cart-context';
import { urlFor, client } from '@/lib/sanity';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductDetails({ product, onClose, onNavigate }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                let query;
                let params = { prodId: product._id };

                if (product.categoryId) {
                    // Try fetching from same category first
                    query = `*[_type == "product" && category._ref == $catId && _id != $prodId][0...6] {
                        _id, name, price, image, slug, "categoryId": category._ref
                    }`;
                    params.catId = product.categoryId;
                } else {
                    // Just fetch any other products
                    query = `*[_type == "product" && _id != $prodId][0...6] {
                        _id, name, price, image, slug, "categoryId": category._ref
                    }`;
                }

                let data = await client.fetch(query, params);

                // If no related products found in category, get any others
                if (data.length === 0 && product.categoryId) {
                    const fallbackQuery = `*[_type == "product" && _id != $prodId][0...6] {
                        _id, name, price, image, slug, "categoryId": category._ref
                    }`;
                    data = await client.fetch(fallbackQuery, { prodId: product._id });
                }

                setRelatedProducts(data);
            } catch (error) {
                console.error("Error fetching related products", error);
            }
        };
        fetchRelated();
    }, [product]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                ...product,
                selectedColor,
                selectedSize
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
                <button onClick={onClose} className="p-2 -ml-2 text-gray-900 bg-gray-50 rounded-full active:scale-95 transition-transform">
                    <ArrowRight className="rotate-180" size={24} />
                </button>
                <h2 className="font-bold text-gray-900 truncate max-w-[200px] uppercase tracking-wider text-sm">{product.name}</h2>
                <div className="w-10"></div>
            </header>

            <main className="pb-32">
                {/* Image Section */}
                <div className="relative aspect-[4/5] w-full bg-gray-50">
                    <Image
                        src={urlFor(product.image).width(1200).url()}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                {/* Content Container */}
                <div className="px-6 py-8 space-y-8 bg-white -mt-4 rounded-t-3xl relative z-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{product.name}</h1>
                        <div className="flex items-baseline gap-2">
                            <p className="text-gray-900 text-3xl font-black">{product.price.toLocaleString()} DA</p>
                        </div>
                    </div>

                    {/* Quick Features */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex-shrink-0 flex items-center gap-2 bg-primary/10 px-4 py-3 rounded-2xl border border-primary/20">
                            <ShieldCheck size={18} className="text-primary" />
                            <span className="text-[12px] font-bold text-gray-700 whitespace-nowrap">Paiement à la livraison</span>
                        </div>
                    </div>

                    {/* Selection Options */}
                    <div className="grid grid-cols-1 gap-6">
                        {product.colors && product.colors.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Couleur</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`min-w-[60px] px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${selectedColor === color ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Taille</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[50px] px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${selectedSize === size ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-3 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-900">Description du produit</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {product.description || "Aucune description disponible pour ce produit."}
                        </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                        <span className="font-bold text-gray-900">Quantité</span>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-500 active:scale-90 transition-transform shadow-sm"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="font-black text-lg w-4 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-500 active:scale-90 transition-transform shadow-sm"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="pt-8 space-y-6">
                            <div className="flex flex-col items-center">
                                <h3 className="text-xl font-light tracking-[0.2em] text-gray-900 uppercase">PRODUITS SIMILAIRES</h3>
                                <div className="w-12 h-[1px] bg-primary mt-2"></div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                                {relatedProducts.map(relProd => (
                                    <div key={relProd._id} className="min-w-[150px] w-[150px] flex-shrink-0">
                                        <ProductCard
                                            product={relProd}
                                            onClick={() => {
                                                onNavigate(relProd);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Sticky Order Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.1em]"
                    >
                        <ShoppingBag size={22} strokeWidth={2.5} />
                        COMMANDER MAINTENANT
                    </button>
                </div>
            </div>
        </div>
    );
}
