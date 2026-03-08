"use client";

import { useCart } from '@/lib/cart-context';
import { urlFor, client } from '@/lib/sanity';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductDetails({ product, onClose, onNavigate }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Derived values from inventory or explicit fields
    const inventory = product.inventory || [];
    
    // Extract unique colors and sizes from inventory that have stock > 0
    const colorsWithStock = Array.from(
        new Set(
            inventory
                .filter(v => v.stock && v.stock > 0)
                .flatMap(v => v.color || [])
        )
    ).filter(Boolean);
    
    const sizesWithStock = Array.from(
        new Set(
            inventory
                .filter(v => v.stock && v.stock > 0)
                .flatMap(v => v.size || [])
        )
    ).filter(Boolean);
    
    // Use new schema fields as priority, fallback to inventory derivation
    const colors = product.colors && product.colors.length > 0 
        ? product.colors 
        : colorsWithStock;
        
    const sizes = product.sizes && product.sizes.length > 0
        ? product.sizes
        : sizesWithStock;
    
    // Add "Standard" only if no sizes are found at all
    if (sizes.length === 0) sizes.push("Standard");

    const [selectedColor, setSelectedColor] = useState(colors[0] || null);
    const [selectedSize, setSelectedSize] = useState(sizes[0] || sizes[0] || "Standard");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const productImages = product.images || (product.image ? [product.image] : []);
    const currentImageUrl = productImages[currentImageIndex]
        ? urlFor(productImages[currentImageIndex]).width(1200).url()
        : '/placeholder.png';

    // Auto-update main image when color changes and handle slide show
    useEffect(() => {
        if (!selectedColor || productImages.length <= 1) return;
        
        // Find all indices of images whose color matches selectedColor
        const matchIndices = productImages
            .map((img, idx) => img.color === selectedColor ? idx : -1)
            .filter(idx => idx !== -1);
        
        if (matchIndices.length > 0) {
            // Set to the first matching image immediately if not already on a matched image
            setCurrentImageIndex((prev) => matchIndices.includes(prev) ? prev : matchIndices[0]);
            
            // If there's more than one matching image and a delay is set, set up interval
            const delay = product.colorImageTransitionDelay;
            if (matchIndices.length > 1 && delay && delay > 0) {
                const intervalId = setInterval(() => {
                    setCurrentImageIndex(prev => {
                        const currentIdxInMatches = matchIndices.indexOf(prev);
                        if (currentIdxInMatches === -1) return matchIndices[0];
                        
                        // Stop at the last image instead of looping back to the first
                        if (currentIdxInMatches === matchIndices.length - 1) {
                            clearInterval(intervalId);
                            return prev;
                        }
                        
                        return matchIndices[currentIdxInMatches + 1];
                    });
                }, delay * 1000); // convert seconds to ms
                
                return () => clearInterval(intervalId);
            }
        }
    }, [selectedColor, productImages, product.colorImageTransitionDelay]);

    // Check if the current combination is in stock
    const currentVariant = inventory.find(v => {
        const hasSize = v.size === selectedSize || (!v.size && selectedSize === "Standard");
        const hasColor = v.color === selectedColor || !v.color;
        return hasSize && hasColor;
    });
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

        addToCart({
            ...product,
            selectedColor,
            selectedSize,
            quantity
        });
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
                    {/* Image Section - Responsive layout for all devices */}
                    <div className="w-full md:w-1/2">
                        <div className="flex flex-row gap-2 sm:gap-3 w-full">
                            {/* Main Image - Adjusted width on mobile for thumbnails */}
                            <div
                                className="relative aspect-[4/5] w-[65%] sm:w-full max-w-[380px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto bg-gray-50 overflow-hidden touch-pan-y rounded-xl md:rounded-3xl shadow-lg md:shadow-xl flex-shrink-0"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <Image
                                    src={currentImageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-contain pointer-events-none p-1 md:p-2"
                                    priority={true}
                                    sizes="(max-width: 640px) 65vw, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                                    quality={100}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                
                                {productImages.length > 1 && (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length); }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-1.5 sm:p-2 transition-all z-10 hover:scale-110 active:scale-90"
                                            aria-label="الصورة السابقة"
                                        >
                                            <ChevronLeft size={32} className="sm:w-10 sm:h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % productImages.length); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-1.5 sm:p-2 transition-all z-10 hover:scale-110 active:scale-90"
                                            aria-label="الصورة التالية"
                                        >
                                            <ChevronRight size={32} className="sm:w-10 sm:h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Vertical Thumbnails - On the RIGHT of main image */}
                            {productImages.length > 1 && (
                                <div className="flex flex-col gap-1.5 sm:gap-2 overflow-y-auto max-h-[450px] pr-1 flex-shrink-0">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${
                                                currentImageIndex === idx 
                                                    ? 'border-primary scale-105 shadow-md ring-2 ring-primary/20' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            style={{
                                                width: '60px',
                                                height: '75px'
                                            }}
                                        >
                                            <Image
                                                src={urlFor(img).width(120).url()}
                                                alt={`${product.name} thumbnail ${idx}`}
                                                width={60}
                                                height={75}
                                                className="object-contain w-full h-full p-0.5 bg-white"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Container - Responsive */}
                    <div className="px-4 md:px-0 py-6 space-y-6 bg-white md:rounded-none relative z-10 md:w-1/2 md:pl-8">
                        <div className="border-b border-gray-100 pb-5 mb-6 overflow-hidden">
                            <h1 className="flex items-center gap-2 text-lg md:text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap overflow-x-auto scrollbar-hide py-1">
                                <span className="flex-shrink-0">{product.name}</span>
                                <span className="text-gray-300 font-light flex-shrink-0 mx-1">|</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {product.comparePrice ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-500 line-through text-sm md:text-base font-bold opacity-80">
                                                {product.comparePrice.toLocaleString()} DA
                                            </span>
                                            <span className="text-xl md:text-2xl font-black text-gray-900">
                                                {product.price.toLocaleString()} DA
                                            </span>
                                            <span className="bg-red-500 text-white text-[10px] md:text-xs px-2 py-1 rounded-md font-black">
                                                -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xl md:text-2xl font-black">{product.price.toLocaleString()} DA</span>
                                    )}
                                </div>
                            </h1>
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

                                            // Get stock for this color (sum across all sizes)
                                            const totalStock = inventory
                                                .filter(v => v.color === rawColor || v.color === displayName)
                                                .reduce((sum, v) => sum + (v.stock || 0), 0);

                                            // Skip if no stock
                                            if (totalStock <= 0) return null;

                                            // Get color hex from inventory variant
                                            const variant = inventory.find(v => 
                                                v.color === displayName || v.color === rawColor
                                            );
                                            
                                            const colorMap = {
                                                // ألوان أساسية
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
                                                'كحلي': '#1e3a8a', 'Navy': '#1e3a8a', 'marine': '#1e3a8a',
                                                
                                                // ألوان إضافية
                                                'بيج': '#d4c4a8', 'Beige': '#d4c4a8', 'beige': '#d4c4a8',
                                                'فضي': '#c0c0c0', 'Silver': '#c0c0c0', 'argent': '#c0c0c0',
                                                'ذهبي': '#ffd700', 'Gold': '#ffd700', 'or': '#ffd700',
                                                'أرجواني': '#9b59b6', 'Mauve': '#9b59b6',
                                                'تركواز': '#40e0d0', 'Turquoise': '#40e0d0',
                                                'زيتوني': '#808000', 'Olive': '#808000',
                                                'نبيتي': '#722f37', 'Bordeaux': '#722f37',
                                                'جملي': '#c19a6b', 'Camel': '#c19a6b',
                                                'فحمي': '#36454f', 'Charcoal': '#36454f',
                                                'سماوي': '#87ceeb', 'Sky': '#87ceeb', 'ciel': '#87ceeb',
                                                'مرجاني': '#ff7f50', 'Coral': '#ff7f50',
                                                'كريمي': '#fffdd0', 'Cream': '#fffdd0', 'crème': '#fffdd0',
                                                'خمري': '#800020', 'Burgundy': '#800020',
                                                'موكا': '#967969', 'Mocha': '#967969',
                                                'برونزي': '#cd7f32', 'Bronze': '#cd7f32',
                                                'كرزي': '#de3163', 'Cerise': '#de3163', 'cerise': '#de3163',
                                                'موف': '#dda0dd', 'Mauve': '#dda0dd',
                                                'فيروزي': '#40e0d0', 'Turquoise': '#40e0d0',
                                                'عسيري': '#808000', 'Olive': '#808000',
                                                'بورдо': '#722f37', 'Bordeaux': '#722f37',
                                                'عاجي': '#fffff0', 'Ivory': '#fffff0',
                                                'ليموني': '#fff700', 'Lemon': '#fff700',
                                                'نيلي': '#4b0082', 'Indigo': '#4b0082',
                                                'عنابي': '#800000', 'Maroon': '#800000',
                                                'مششي': '#ffb6c1', 'Light Pink': '#ffb6c1',
                                                'ترابي': '#976647', 'Earth': '#976647',
                                                'طوبي': '#b7410e', 'Rust': '#b7410e',
                                                'خشبي': '#8b4513', 'Wood': '#8b4513',
                                                'مشمشي': '#fbceb1', 'Apricot': '#fbceb1',
                                                'خوخي': '#ffcba4', 'Peach': '#ffcba4',
                                                'حجر': '#7f7f7f', 'Stone': '#7f7f7f',
                                                'رصاصي': '#70809a', 'Slate': '#70809a',
                                            };
                                            
                                            const bgColor = variant?.colorHex || colorMap[rawColor] || colorMap[displayName] || rawColor;
                                            const isWhite = bgColor.toLowerCase() === '#ffffff' || bgColor.toLowerCase() === 'white';
                                            const isActive = selectedColor === colorStr;

                                            return (
                                                <div key={colorStr} className="flex flex-col items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedColor(colorStr)}
                                                        disabled={totalStock <= 0}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 relative ${
                                                            isActive ? 'border-primary ring-2 ring-primary/20 scale-110' : 
                                                            totalStock <= 0 ? 'border-gray-200 opacity-40 cursor-not-allowed' :
                                                            'border-gray-100 hover:border-gray-300'
                                                        }`}
                                                        style={{ backgroundColor: bgColor }}
                                                        title={`${displayName} - ${totalStock} متوفر`}
                                                    >
                                                        {isWhite && <div className="absolute inset-0 border border-gray-100 rounded-full pointer-events-none" />}
                                                        {isActive && (
                                                            <div className={`absolute inset-0 flex items-center justify-center`}>
                                                                <div className={`w-2 h-2 rounded-full ${isWhite ? 'bg-primary' : 'bg-white'}`} />
                                                            </div>
                                                        )}
                                                        {totalStock <= 0 && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-full h-0.5 bg-red-500 rotate-45" />
                                                            </div>
                                                        )}
                                                    </button>
                                                    <div className="text-center">
                                                        <span className={`text-[10px] font-bold block ${isActive ? 'text-primary' : 'text-gray-400'}`}>{displayName}</span>
                                                        {totalStock > 0 && (
                                                            <span className="text-[9px] font-bold text-black block">{totalStock}</span>
                                                        )}
                                                    </div>
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
                                        {sizes.map(size => {
                                            // Get stock for this size (sum across all colors)
                                            const totalStock = inventory
                                                .filter(v => v.size === size)
                                                .reduce((sum, v) => sum + (v.stock || 0), 0);

                                            // Skip if no stock
                                            if (totalStock <= 0) return null;

                                            const isSelected = selectedSize === size;

                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    disabled={totalStock <= 0}
                                                    className={`min-w-[50px] px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all relative ${
                                                        isSelected 
                                                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                                                            : totalStock <= 0
                                                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span>{size}</span>
                                                        {totalStock > 0 && (
                                                            <span className="text-[9px] font-bold text-black mt-0.5">{totalStock}</span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
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

                        {/* Quantity and Add to Cart - Side by Side */}
                        <div className="flex items-center gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 rounded-2xl border border-gray-100 flex-shrink-0">
                                <span className="font-bold text-gray-900 text-sm">Quantité</span>
                                <div className="flex items-center gap-4 ml-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-500 active:scale-90 transition-transform shadow-sm"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-black text-base w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-500 active:scale-90 transition-transform shadow-sm"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-wider ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-primary shadow-primary/30'}`}
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} />
                                {isOutOfStock ? 'Non disponible' : 'Commander'}
                            </button>
                        </div>

                        {/* Quick Features */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pt-2">
                            <div className="flex-1 flex items-center justify-center gap-2 bg-primary/5 px-3 py-2.5 rounded-xl border border-primary/10">
                                <ShieldCheck size={16} className="text-primary" />
                                <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap uppercase tracking-tight">Paiement à la livraison</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center gap-2 bg-green-50/50 px-3 py-2.5 rounded-xl border border-green-100">
                                <Truck size={16} className="text-green-600" />
                                <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap uppercase tracking-tight">Livraison rapide</span>
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
        </div>
    );
}
