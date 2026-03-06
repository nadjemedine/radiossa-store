"use client";

import { CheckCircle2, ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export default function ThankYou({ onReturnToStore }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-in w-full max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative sm:w-24 sm:h-24">
                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
                <CheckCircle2 size={48} className="text-green-500 relative z-10 sm:size-16" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-wider sm:text-3xl">
                MERCI !
            </h2>

            <p className="text-gray-500 text-base mb-4 leading-relaxed max-w-xs mx-auto sm:text-lg sm:mb-6">
                Votre commande a été reçue avec succès. <br />
                <span className="font-bold text-gray-800">Nous vous contacterons bientôt</span> pour confirmer la livraison.
            </p>


            <div className="w-full space-y-3 max-w-xs sm:max-w-sm sm:space-y-4">
                <button
                    onClick={onReturnToStore}
                    className="w-full bg-primary text-white py-4 rounded-full font-black text-base shadow-xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-2 sm:py-5 sm:text-lg sm:tracking-[0.2em] sm:gap-3"
                >
                    <Home size={18} className="sm:size-5" />
                    RETOURNER À L'ACCUEIL
                </button>

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-3 sm:pt-4 sm:text-[11px]">
                    Radiossa Store - Votre boutique préférée
                </p>
            </div>
        </div>
    );
}
