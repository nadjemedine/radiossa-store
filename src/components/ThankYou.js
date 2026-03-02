"use client";

import { CheckCircle2, ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export default function ThankYou({ onReturnToStore }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
                <CheckCircle2 size={64} className="text-green-500 relative z-10" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-wider">
                MERCI !
            </h2>

            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-xs mx-auto">
                Votre commande a été reçue avec succès. <br />
                <span className="font-bold text-gray-800">Nous vous contacterons bientôt</span> pour confirmer la livraison.
            </p>

            <div className="mb-4 text-center" dir="rtl">
                <h3 className="text-xl font-black text-gray-900 mb-1">شكراً لك!</h3>
                <p className="text-gray-500 font-medium text-sm">تم استلام طلبك بنجاح. سنتصل بك قريباً لتأكيد التوصيل.</p>
            </div>

            <div className="w-full space-y-4 max-w-sm mt-8">
                <button
                    onClick={onReturnToStore}
                    className="w-full bg-primary text-white py-5 rounded-full font-black text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                >
                    <Home size={22} />
                    RETOURNER À L'ACCUEIL
                </button>

                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest pt-4">
                    Radiossa Store - Votre boutique préférée
                </p>
            </div>
        </div>
    );
}
