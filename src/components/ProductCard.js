"use client";

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product, onClick }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white group cursor-pointer" onClick={onClick}>
            <div className="relative aspect-[3/4] w-full mb-3 overflow-hidden bg-gray-50 rounded-lg">
                <Image
                    src={urlFor(product.image).width(600).url()}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-primary transition-colors">
                    <Heart size={18} />
                </button>
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
                            {(Math.round((1 - product.price / product.comparePrice) * 100))}% OFF
                        </div>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="w-full mt-2 bg-primary text-white text-[11px] font-bold py-2.5 rounded hover:opacity-90 transition-all uppercase tracking-wider"
                >
                    AJOUTER AU PANIER
                </button>
            </div>
        </div>
    );
}

