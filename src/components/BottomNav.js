"use client";

import { Store, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function BottomNav({ activeTab, setActiveTab }) {
    const { cartCount } = useCart();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
            <button
                onClick={() => setActiveTab('store')}
                className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'store' ? 'text-primary' : 'text-gray-400'}`}
            >
                <Store size={22} className="mb-1" />
                <span className="text-xs font-bold uppercase tracking-tighter">Boutique</span>
            </button>

            <button
                onClick={() => setActiveTab('cart')}
                className={`flex flex-col items-center flex-1 transition-colors relative ${activeTab === 'cart' ? 'text-primary' : 'text-gray-400'}`}
            >
                {cartCount > 0 && (
                    <span className="absolute top-[-5px] right-[30%] bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                    </span>
                )}
                <ShoppingCart size={22} className="mb-1" />
                <span className="text-xs font-bold uppercase tracking-tighter">Panier</span>
            </button>
        </nav>
    );
}
