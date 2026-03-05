"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import SideMenu from '@/components/SideMenu';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import CheckoutForm from '@/components/CheckoutForm';
import ProductDetails from '@/components/ProductDetails';
import ThankYou from '@/components/ThankYou';
import SuiviCommandePage from './suivi-commande/page'; // Add import for the tracking page
import ContactPage from './contact/page'; // Add import for the contact page
import Footer from '@/components/Footer';
import PreFooter from '@/components/PreFooter';
import LineSeparator from '@/components/LineSeparator';
import { client } from '@/lib/sanity';
import { X, ChevronRight } from 'lucide-react';

export default function Home() {
    const [activeTab, setActiveTab] = useState('store');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storeFront, setStoreFront] = useState({
        productsTitle: '',
        showProductsTitle: false,
        titleStyle: 'bold-italic',
        titleColor: '#000000',
        showUnderline: true,
    });

    // Function to filter out of stock products
    const filterOutOfStockProducts = useCallback((productsData) => {
        return productsData.filter(product => {
            // If product has no inventory or autoHide is disabled, show it
            if (!product.inventory || product.inventory.length === 0) {
                return true;
            }

            // If autoHideOutOfStock is explicitly false, show it
            if (product.autoHideOutOfStock === false) {
                return true;
            }

            // Check if at least one variant is in stock
            const hasStock = product.inventory.some(variant => {
                // If tracking is disabled, consider it in stock
                if (!variant.trackInventory) {
                    return true;
                }
                // If backorder is allowed, consider it available
                if (variant.allowBackorder) {
                    return true;
                }
                // Check actual stock quantity
                return variant.stock > 0;
            });

            return hasStock;
        });
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                // Fetch all products
                const productsQuery = `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc)`;

                const [productsData, storeFrontData] = await Promise.all([
                    client.fetch(productsQuery),
                    client.fetch(`*[_type == "storeFront"][0]`)
                ]);

                // Filter out of stock products
                const filteredProducts = filterOutOfStockProducts(productsData);
                setProducts(filteredProducts);
                if (storeFrontData) {
                    // Merge with defaults to ensure all fields are present
                    setStoreFront(prev => ({
                        ...prev,
                        ...storeFrontData,
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();

        // Re-fetch products every 30 seconds to keep inventory updated
        const intervalId = setInterval(async () => {
            try {
                const productsQuery = `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc)`;
                const productsData = await client.fetch(productsQuery);
                const filteredProducts = filterOutOfStockProducts(productsData);
                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error re-fetching products:", error);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [filterOutOfStockProducts]);

    // Memoize filtered products to prevent unnecessary re-renders
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            const searchMatch = !showSearchResults ||
                searchQuery === '' ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter
            const categoryMatch = !selectedCategory ||
                product.category?._ref === selectedCategory.id;

            return searchMatch && categoryMatch;
        });
    }, [products, showSearchResults, searchQuery, selectedCategory]);

    return (
        <div
            className="max-w-md mx-auto min-h-screen bg-background relative overflow-x-hidden"
        >
            {/* Background overlay for better content readability */}
            <div className="absolute inset-0 bg-white/80"></div>

            <div className="relative z-10">
                <Header
                    activeTab={activeTab}
                    onCartClick={() => setActiveTab('cart')}
                    onMenuClick={() => setIsMenuOpen(true)}
                    onLogoClick={() => {
                        setActiveTab('store');
                        setSelectedCategory(null);
                        setShowSearchResults(false);
                    }}
                    onSearchClick={() => {
                        console.log('Search clicked - activating search functionality');
                        // Toggle search mode
                        setShowSearchResults(!showSearchResults);
                        setActiveTab('store');
                        if (!showSearchResults) setSelectedCategory(null);
                    }}
                    onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        setActiveTab('store');
                        setShowSearchResults(false);
                    }}
                    activeCategoryId={selectedCategory?.id}
                />

                <SideMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        setIsMenuOpen(false);
                        setActiveTab('store');
                        setShowSearchResults(false);
                    }}
                    onCartClick={() => {
                        setActiveTab('cart');
                        setIsMenuOpen(false);
                    }}
                    onNavigateToPage={(page) => setActiveTab(page)}
                />

                {activeTab === 'store' && storeFront.showProductsTitle !== false && (
                    <div className="flex flex-col items-center mt-6 mb-8">
                        <h1
                            className={`text-2xl relative inline-block ${storeFront.titleStyle === 'uppercase' ? 'font-black uppercase tracking-widest' :
                                storeFront.titleStyle === 'elegant' ? 'font-light tracking-[0.3em] uppercase' :
                                    storeFront.titleStyle === 'bold' ? 'font-bold' :
                                        'font-bold italic'
                                }`}
                            style={{ color: storeFront.titleColor || '#000000' }}
                        >
                            {storeFront.productsTitle}
                            {(storeFront.showUnderline !== false) && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></div>
                            )}
                        </h1>
                    </div>
                )}

                <main className="px-4 pb-20">
                    {activeTab === 'store' ? (
                        <div>
                            {/* Category Filter Indicator */}
                            {selectedCategory && (
                                <div className="mb-6 flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                            <ChevronRight size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Collection</p>
                                            <h2 className="text-lg font-bold text-gray-800">{selectedCategory.name}</h2>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="p-2 hover:bg-white rounded-full transition-colors text-primary"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            {/* Search Input when search mode is active */}
                            {showSearchResults && (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Rechercher des produits..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors font-medium text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSearchResults(false);
                                        }}
                                        className="mt-2 text-sm text-gray-500 hover:text-primary"
                                    >
                                        Annuler la recherche
                                    </button>
                                </div>
                            )}


                            {/* Products Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {isLoading ? (
                                    <>
                                        <ProductSkeleton />
                                        <ProductSkeleton />
                                        <ProductSkeleton />
                                        <ProductSkeleton />
                                    </>
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <div
                                            key={product._id}
                                            className="animate-fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onClick={() => setSelectedProduct(product)}
                                                priority={index < 4}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-medium">
                                            Aucun produit dans cette sélection
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(null);
                                                setShowSearchResults(false);
                                                setSearchQuery('');
                                            }}
                                            className="mt-4 text-primary font-bold text-sm underline"
                                        >
                                            Voir tout le catalogue
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'thanks' ? (
                        <ThankYou onReturnToStore={() => setActiveTab('store')} />
                    ) : activeTab === 'tracking' ? (
                        <SuiviCommandePage />
                    ) : activeTab === 'contact' ? (
                        <ContactPage />
                    ) : (
                        <CheckoutForm onSuccess={() => setActiveTab('thanks')} />
                    )}
                </main>

                {/* Product Details Modal */}
                {selectedProduct && (
                    <ProductDetails
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onNavigate={(p) => setSelectedProduct(p)}
                    />
                )}

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab !== 'contact' && <PreFooter />}
                {activeTab !== 'contact' && <LineSeparator />}
                {activeTab !== 'contact' && <Footer />}
            </div>
        </div>
    );
}
