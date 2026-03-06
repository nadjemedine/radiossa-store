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

    // Derived values from inventory
    const inventory = product.inventory || [];
    const availableColorsSet = new Set();
    const availableSizesSet = new Set();

    inventory.forEach(variant => {
        if (variant.color) availableColorsSet.add(variant.color);
        if (variant.size) availableSizesSet.add(variant.size);
    });

    const colors = Array.from(availableColorsSet);
    const sizes = Array.from(availableSizesSet);

    const [selectedColor, setSelectedColor] = useState(colors[0] || null);
    const [selectedSize, setSelectedSize] = useState(sizes[0] || "Standard");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const productImages = product.images || (product.image ? [product.image] : []);
    const currentImageUrl = productImages[currentImageIndex]
        ? urlFor(productImages[currentImageIndex]).width(1200).url()
        : '/placeholder.png';

    // Check if the current combination is in stock
    const currentVariant = inventory.find(v =>
        (v.size === selectedSize || (!v.size && selectedSize === "Standard")) &&
        (v.color === selectedColor || !v.color)
    );
    const isOutOfStock = currentVariant ? currentVariant.stock <= 0 : (inventory.length > 0 ? true : false);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                let query;
                let params = { prodId: product._id };

                if (product.categoryId) {
                    query = `*[_type == "product" && category._ref == $catId && _id != $prodId][0...6] {
                        _id, name, price, comparePrice, image, images, slug, "categoryId": category._ref
                    }`;
                    params.catId = product.categoryId;
                } else {
                    query = `*[_type == "product" && _id != $prodId][0...6] {
                        _id, name, price, comparePrice, image, images, slug, "categoryId": category._ref
                    }`;
                }

                let data = await client.fetch(query, params);
                if (data.length === 0 && product.categoryId) {
                    const fallbackQuery = `*[_type == "product" && _id != $prodId][0...6] {
                        _id, name, price, comparePrice, image, images, slug, "categoryId": category._ref
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
        if (isOutOfStock) return;

        for (let i = 0; i < quantity; i++) {
            addToCart({
                ...product,
                selectedColor,
                selectedSize
            });
        }
        onClose();
    };

    // Swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && productImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
        } else if (isRightSwipe && productImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2 text-gray-900 bg-gray-50 rounded-full active:scale-95 transition-transform">
                        <ArrowRight className="" size={24} />
                    </button>
                    <h2 className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-md uppercase tracking-wider text-sm md:text-base">{product.name}</h2>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="pb-32 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12 md:p-8">
                    {/* Image Section */}
                    <div
                        className="relative aspect-[4/5] w-full md:w-1/2 bg-gray-50 overflow-hidden touch-pan-y md:rounded-3xl shadow-xl"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <Image
                            src={currentImageUrl}
                            alt={product.name}
                            fill
                            className="object-cover pointer-events-none"
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            quality={75}
                        />

                        {/* Thumbnails Overlay */}
                        {productImages.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary scale-110 shadow-lg' : 'border-white/50 backdrop-blur-sm'}`}
                                    >
                                        <Image
                                            src={urlFor(img).width(100).url()}
                                            alt={`${product.name} thumbnail ${idx}`}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Content Container */}
                    <div className="px-6 py-8 space-y-8 bg-white -mt-4 md:mt-0 rounded-t-3xl md:rounded-none relative z-10 md:w-1/2">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-baseline gap-2">
                                <div className="space-y-2">
                                    <p className="text-gray-900 text-3xl font-black">
                                        {product.comparePrice ? (
                                            <>
                                                <span className="text-red-500 line-through text-xl mr-3">
                                                    {product.comparePrice.toLocaleString()} DA
                                                </span>
                                                {product.price.toLocaleString()} DA
                                            </>
                                        ) : (
                                            <>{product.price.toLocaleString()} DA</>
                                        )}
                                    </p>
                                    {product.comparePrice && (
                                        <div className="text-sm bg-red-500 text-white px-3 py-1 rounded-full inline-block font-bold">
                                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Features */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex-shrink-0 flex items-center gap-2 bg-primary/10 px-4 py-3 rounded-2xl border border-primary/20">
                                <ShieldCheck size={18} className="text-primary" />
                                <span className="text-[12px] font-bold text-gray-700 whitespace-nowrap">Paiement à la livraison</span>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2 bg-green-50 px-4 py-3 rounded-2xl border border-green-100">
                                <Truck size={18} className="text-green-600" />
                                <span className="text-[12px] font-bold text-gray-700 whitespace-nowrap">Livraison rapide</span>
                            </div>
                        </div>

                        {/* Selection Options - Responsive Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                            {colors.length > 0 && (
                                <div className="space-y-4 text-left">
                                    <h3 className="font-bold text-gray-900">Couleur</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map(colorStr => {
                                            const parts = colorStr.includes('|') ? colorStr.split('|') : colorStr.includes(':') ? colorStr.split(':') : [colorStr];
                                            const displayName = parts[0].trim();
                                            const rawColor = parts.length > 1 ? parts[1].trim() : parts[0].trim();

                                            const colorMap = {
                                                'أسود': '#000000', 'Black': '#000000', 'noir': '#000000',
                                                'أبيض': '#FFFFFF', 'White': '#FFFFFF', 'blanc': '#FFFFFF',
                                                'أحمر': '#ef4444', 'Red': '#ef4444', 'rouge': '#ef4444',
                                                'أزرق': '#3b82f6', 'Blue': '#3b82f6', 'bleu': '#3b82f6',
                                                'أخضر': '#22c55e', 'Green': '#22c55e', 'vert': '#22c55e',
                                                'أصفر': '#eab308', 'Yellow': '#eab308', 'jaune': '#eab308',
                                                'بني': '#92400e', 'Brown': '#92400e', 'marron': '#92400e',
                                                'رمادي': '#6b7280', 'Grey': '#6b7280', 'gris': '#6b7280',
                                                'وردي': '#ec4899', 'Pink': '#ec4899', 'rose': '#ec4899',
                                                'برتقالي': '#f97316', 'Orange': '#f97316',
                                                'بنفسجي': '#8b5cf6', 'Purple': '#8b5cf6', 'violet': '#8b5cf6',
                                                'كحلي': '#1e3a8a', 'Navy': '#1e3a8a', 'marine': '#1e3a8a'
                                            };

                                            const bgColor = colorMap[rawColor] || rawColor;
                                            const isWhite = bgColor.toLowerCase() === '#ffffff' || bgColor.toLowerCase() === 'white';
                                            const isActive = selectedColor === colorStr;

                                            return (
                                                <div key={colorStr} className="flex flex-col items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedColor(colorStr)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 relative ${isActive ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-gray-100 hover:border-gray-300'}`}
                                                        style={{ backgroundColor: bgColor }}
                                                        title={displayName}
                                                    >
                                                        {isWhite && <div className="absolute inset-0 border border-gray-100 rounded-full pointer-events-none" />}
                                                        {isActive && (
                                                            <div className={`absolute inset-0 flex items-center justify-center`}>
                                                                <div className={`w-2 h-2 rounded-full ${isWhite ? 'bg-primary' : 'bg-white'}`} />
                                                            </div>
                                                        )}
                                                    </button>
                                                    <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>{displayName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {sizes.length > 0 && (
                                <div className="space-y-4 text-left">
                                    <h3 className="font-bold text-gray-900">Taille</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map(size => (
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

                        {/* Stock Status */}
                        {isOutOfStock && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-red-500 font-bold text-center text-sm">Désolé, cette option n'est pas disponible pour le moment</p>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="space-y-3 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                                <h3 className="font-bold text-gray-900">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-left">
                                    {product.description}
                                </p>
                            </div>
                        )}

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
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="px-6 py-12 space-y-8">
                        <div className="flex flex-col items-center">
                            <h3 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">Produits similaires</h3>
                            <div className="w-12 h-1 bg-primary mt-3 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedProducts.map(relProd => (
                                <div key={relProd._id} className="animate-fade-in">
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
            </main>

            {/* Sticky Order Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 z-50">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`w-full md:w-1/2 md:mx-auto text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all uppercase tracking-[0.1em] ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-primary shadow-primary/30'}`}
                    >
                        <ShoppingBag size={22} strokeWidth={2.5} />
                        {isOutOfStock ? 'Non disponible' : 'Commander maintenant'}
                    </button>
                </div>
            </div>
        </div>
    );
}
