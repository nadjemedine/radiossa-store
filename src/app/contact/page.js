"use client";

import { useState, useEffect } from 'react';
import { client, urlFor } from '@/lib/sanity';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    whatsapp: MessageCircle,
    tiktok: Instagram,
    youtube: Instagram,
};

export default function ContactPage() {
    const [footerData, setFooterData] = useState(null);

    useEffect(() => {
        async function fetchFooter() {
            try {
                const data = await client.fetch(`*[_type == "footer"][0]`);
                setFooterData(data);
            } catch (error) {
                console.error("Error fetching footer:", error);
            }
        }
        fetchFooter();
    }, []);

    if (!footerData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-500">Chargement des informations de contact...</p>
                </div>
            </div>
        );
    }

    // Default colors if not specified
    const textColor = footerData.textColor || '#000000';
    const iconColor = footerData.iconColor || '#000000';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto px-4">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Contactez-nous</h1>
                
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Informations de Contact</h2>
                    
                    {footerData.contactInfo && (
                        <div className="space-y-4">
                            {footerData.contactInfo.phone && (
                                <a 
                                    href={`tel:${footerData.contactInfo.phone}`}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Phone size={20} style={{ color: iconColor }} />
                                        </div>
                                        <span className="font-medium">Téléphone</span>
                                    </div>
                                    <span style={{ color: textColor }}>{footerData.contactInfo.phone}</span>
                                </a>
                            )}
                            
                            {footerData.contactInfo.email && (
                                <a 
                                    href={`mailto:${footerData.contactInfo.email}`}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Mail size={20} style={{ color: iconColor }} />
                                        </div>
                                        <span className="font-medium">Email</span>
                                    </div>
                                    <span style={{ color: textColor }}>{footerData.contactInfo.email}</span>
                                </a>
                            )}
                            
                            {footerData.contactInfo.address && (
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <MapPin size={20} style={{ color: iconColor }} />
                                        </div>
                                        <div>
                                            <div className="font-medium mb-1">Adresse</div>
                                            <span style={{ color: textColor }}>{footerData.contactInfo.address}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {footerData.socialLinks && footerData.socialLinks.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Réseaux Sociaux</h2>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {footerData.socialLinks.map((link, index) => {
                                const IconComponent = platformIcons[link.platform] || Instagram;
                                return (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <IconComponent
                                                size={18}
                                                style={{ color: iconColor }}
                                            />
                                        </div>
                                        <span className="font-medium capitalize">{link.platform}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {footerData.description && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">À propos de nous</h2>
                        <p className="text-gray-600 text-center">{footerData.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}