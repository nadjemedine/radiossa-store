"use client";

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function SuiviCommandePage() {
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrackOrder = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        
        setLoading(true);
        
        // Simulate API call to track order
        setTimeout(() => {
            // Sample order statuses
            const statuses = ['En traitement', 'Expédiée', 'En cours de livraison', 'Livrée'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            setOrderStatus({
                id: orderId,
                status: randomStatus,
                estimatedDelivery: '2024-01-15',
                lastUpdate: new Date().toLocaleDateString('fr-DZ'),
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto px-4">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Suivi de Commande</h1>
                
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                    <form onSubmit={handleTrackOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Numéro de Commande
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Entrez votre numéro de commande"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-primary transition-colors pr-12"
                                />
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Recherche en cours...' : 'Suivre ma commande'}
                        </button>
                    </form>
                </div>

                {orderStatus && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Commande #{orderStatus.id}</h2>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                orderStatus.status === 'Livrée' ? 'bg-green-100 text-green-800' :
                                orderStatus.status === 'En cours de livraison' ? 'bg-blue-100 text-blue-800' :
                                orderStatus.status === 'Expédiée' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {orderStatus.status}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className={`p-2 rounded-full ${
                                    orderStatus.status === 'Livrée' ? 'bg-green-100 text-green-600' :
                                    'bg-gray-100 text-gray-400'
                                }`}>
                                    <CheckCircle size={20} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-bold text-gray-900">Commande confirmée</h3>
                                    <p className="text-sm text-gray-500">2024-01-10</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`p-2 rounded-full ${
                                    ['Expédiée', 'En cours de livraison', 'Livrée'].includes(orderStatus.status) ? 
                                    'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    <Truck size={20} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-bold text-gray-900">Expédiée</h3>
                                    <p className="text-sm text-gray-500">2024-01-12</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`p-2 rounded-full ${
                                    ['En cours de livraison', 'Livrée'].includes(orderStatus.status) ? 
                                    'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    <Package size={20} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-bold text-gray-900">En cours de livraison</h3>
                                    <p className="text-sm text-gray-500">2024-01-14</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className={`p-2 rounded-full ${
                                    orderStatus.status === 'Livrée' ? 
                                    'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    <CheckCircle size={20} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-bold text-gray-900">Livrée</h3>
                                    <p className="text-sm text-gray-500">Livraison estimée: {orderStatus.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!orderStatus && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Suivez votre commande</h3>
                        <p className="text-gray-500 text-sm">
                            Entrez votre numéro de commande pour suivre son statut en temps réel
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}