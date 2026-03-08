"use client";

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export default function ProductCard({ product, onClick, priority = false }) {
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const productImages = product?.images || (product?.image ? [product.image] : []);
    const currentImage = productImages[currentImageIndex];
    const imageUrl = currentImage ? urlFor(currentImage).width(600).url() : '/placeholder.png';

    // Swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = (e) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            e.stopPropagation(); // Prevent clicking/navigating when swiping
            if (isLeftSwipe && productImages.length > 1) {
                setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
            } else if (isRightSwipe && productImages.length > 1) {
                setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
            }
        }
    };

    return (
        <div className="bg-white group cursor-pointer" onClick={onClick}>
            <div
                className="relative aspect-[3/4] w-full mb-3 overflow-hidden bg-gray-50 rounded-lg touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105 pointer-events-none p-1 bg-white"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={priority}
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-primary transition-colors">
                    <Heart size={18} />
                </button>

                {/* Dots indicator for swiping */}
                {productImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {productImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-primary w-3' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="space-y-1 px-1">
                <h3 className="text-[13px] font-medium text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                <div className="space-y-1">
                    <p className="text-gray-900 font-bold text-sm">
                        {product.comparePrice ? (
                            <>
                                <span className="text-red-500 line-through text-xs mr-2">
                                    {product.comparePrice.toLocaleString()} DA
                                </span>
                                {product.price.toLocaleString()} DA
                            </>
                        ) : (
                            <>{product.price.toLocaleString()} DA</>
                        )}
                    </p>
                    {product.comparePrice && (
                        <div className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full inline-block font-bold">
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                        </div>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Pick default variants if they exist
                        const defaultColor = (product.colors && product.colors.length > 0) ? product.colors[0] : null;
                        const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "Standard";
                        
                        addToCart({
                            ...product,
                            selectedColor: defaultColor,
                            selectedSize: defaultSize,
                            quantity: 1
                        });
                    }}
                    className="w-full mt-2 bg-primary text-white text-[11px] font-bold py-2.5 rounded hover:opacity-90 transition-all uppercase tracking-wider"
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
}
