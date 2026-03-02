"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { client, urlFor } from '@/lib/sanity';
import { submitOrder } from '@/app/actions';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

const wilayaNamesFR = {
    "1": "Adrar", "2": "Chlef", "3": "Laghouat", "4": "Oum El Bouaghi", "5": "Batna",
    "6": "Béjaïa", "7": "Biskra", "8": "Béchar", "9": "Blida", "10": "Bouira",
    "11": "Tamanrasset", "12": "Tébessa", "13": "Tlemcen", "14": "Tiaret", "15": "Tizi Ouzou",
    "16": "Alger", "17": "Djelfa", "18": "Jijel", "19": "Sétif", "20": "Saïda",
    "21": "Skikda", "22": "Sidi Bel Abbès", "23": "Annaba", "24": "Guelma", "25": "Constantine",
    "26": "Médéa", "27": "Mostaganem", "28": "M'Sila", "29": "Mascara", "30": "Ouargla",
    "31": "Oran", "32": "El Bayadh", "33": "Illizi", "34": "Bordj Bou Arréridj", "35": "Boumerdès",
    "36": "El Tarf", "37": "Tindouf", "38": "Tissemsilt", "39": "El Oued", "40": "Khenchela",
    "41": "Souk Ahras", "42": "Tipaza", "43": "Mila", "44": "Aïn Defla", "45": "Naâma",
    "46": "Aïn Témouchent", "47": "Ghardaïa", "48": "Relizane", "49": "El M'Ghair", "50": "El Meniaa",
    "51": "Ouled Djellal", "52": "Bordj Baji Mokhtar", "53": "Béni Abbès", "54": "Timimoun", "55": "Touggourt",
    "56": "Djanet", "57": "In Salah", "58": "In Guezzam"
};

export default function CheckoutForm({ onSuccess }) {
    const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const [deliveryPrices, setDeliveryPrices] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        wilayaId: '',
        commune: '',
        shippingType: 'homePrice'
    });

    useEffect(() => {
        async function fetchDelivery() {
            try {
                const data = await client.fetch(`*[_type == "delivery"]`);
                // Sort numerically by converting stateCode to number
                const sortedData = data.sort((a, b) => parseInt(a.stateCode) - parseInt(b.stateCode));
                setDeliveryPrices(sortedData);
            } catch (error) {
                console.error("Error fetching delivery prices:", error);
            }
        }
        fetchDelivery();
    }, []);

    const selectedWilaya = deliveryPrices.find(w => w.stateCode === formData.wilayaId);
    const shippingCost = selectedWilaya ? selectedWilaya[formData.shippingType] : 0;
    const grandTotal = totalPrice + shippingCost;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const frenchWilayaName = wilayaNamesFR[formData.wilayaId] || (selectedWilaya ? selectedWilaya.stateName : formData.wilayaId);
            const orderDoc = {
                _type: 'order',
                customerName: formData.name,
                phone: formData.phone,
                wilaya: selectedWilaya ? `${formData.wilayaId} - ${frenchWilayaName}` : formData.wilayaId,
                commune: formData.commune,
                shippingType: formData.shippingType === 'homePrice' ? 'Domicile' : 'Bureau',
                items: cart.map(item => ({
                    _key: Math.random().toString(36).substring(7),
                    productName: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    color: item.selectedColor || 'N/A',
                    size: item.selectedSize || 'N/A'
                })),
                totalPrice: grandTotal,
                status: 'pending'
            };

            // Call Server Action instead of client-side libs
            const result = await submitOrder(orderDoc);

            if (result.success) {
                clearCart();
                if (onSuccess) onSuccess();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("Une erreur est survenue lors de l'envoi de la commande. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <ShoppingBag size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h3>
                <p className="text-gray-500 mb-8">Ajoutez des articles pour commencer votre commande.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cart Items List */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-primary" />
                    VOTRE PANIER ({cart.length})
                </h2>
                <div className="divide-y divide-gray-50">
                    {cart.map((item) => (
                        <div key={item._id} className="py-4 flex gap-4">
                            <div className="relative w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={urlFor(item.image).width(200).url()}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {item.selectedSize && `Taille: ${item.selectedSize}`}
                                        {item.selectedColor && ` • Couleur: ${item.selectedColor}`}
                                    </p>
                                    <p className="text-gray-900 font-black text-sm mt-1">{item.price.toLocaleString()} DA</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-4 bg-gray-50 rounded-full px-3 py-1 scale-90 -ml-2">
                                        <button
                                            onClick={() => updateQuantity(item._id, -1)}
                                            className="text-gray-400 hover:text-gray-900"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold text-xs">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, 1)}
                                            className="text-gray-400 hover:text-gray-900"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="font-bold text-gray-500 text-sm">Sous-total</span>
                    <span className="font-black text-gray-900">{totalPrice.toLocaleString()} DA</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 text-left">
                <h2 className="text-center text-primary text-xl font-black mb-6 uppercase tracking-widest">INFOS DE LIVRAISON</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-gray-400">Nom et Prénom</label>
                        <input
                            type="text"
                            required
                            placeholder="Votre nom complet"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:border-primary transition-colors font-medium text-sm px-6"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-gray-400">Numéro de Téléphone</label>
                        <input
                            type="tel"
                            required
                            placeholder="05 / 06 / 07"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:border-primary transition-colors font-medium text-sm px-6"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-gray-400">Wilaya</label>
                            <select
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:border-primary transition-colors font-medium text-sm appearance-none px-6"
                                value={formData.wilayaId}
                                onChange={(e) => setFormData({ ...formData, wilayaId: e.target.value })}
                            >
                                <option value="">Choisir...</option>
                                {deliveryPrices.map(w => (
                                    <option key={w.stateCode} value={w.stateCode}>{w.stateCode} - {wilayaNamesFR[w.stateCode] || w.stateName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-gray-400">Commune</label>
                            <input
                                type="text"
                                required
                                placeholder="La commune"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:border-primary transition-colors font-medium text-sm px-6"
                                value={formData.commune}
                                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider mb-1.5 text-gray-400">Type de Livraison</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, shippingType: 'homePrice' })}
                                className={`p-4 rounded-full border-2 text-xs font-black transition-all uppercase tracking-widest ${formData.shippingType === 'homePrice' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400'}`}
                            >
                                Domicile
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, shippingType: 'officePrice' })}
                                className={`p-4 rounded-full border-2 text-xs font-black transition-all uppercase tracking-widest ${formData.shippingType === 'officePrice' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400'}`}
                            >
                                Bureau
                            </button>
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="bg-gray-50 rounded-3xl p-5 space-y-3 mt-6 border border-gray-100">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>SOUS-TOTAL:</span>
                            <span>{totalPrice.toLocaleString()} DA</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>LIVRAISON:</span>
                            <span>{shippingCost > 0 ? `${shippingCost.toLocaleString()} DA` : 'Calculé...'}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black border-t border-gray-200 pt-3 text-gray-900">
                            <span>TOTAL À PAYER:</span>
                            <span>{grandTotal.toLocaleString()} DA</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-5 rounded-full font-black text-lg mt-4 shadow-xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'ENVOI EN COURS...' : 'CONFIRMER LA COMMANDE'}
                    </button>
                </form>
            </div>
        </div>
    );
}

