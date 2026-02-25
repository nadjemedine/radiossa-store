"use client";

import { useState, useEffect } from 'react';
import { client, urlFor } from '@/lib/sanity';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    whatsapp: Phone,
    tiktok: Instagram,
    youtube: Instagram,
};

export default function Footer() {
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

    if (!footerData) return null;

    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    {footerData.title && (
                        <h2 className="text-2xl font-bold mb-3">{footerData.title}</h2>
                    )}
                    {footerData.description && (
                        <p className="text-gray-300 text-sm">{footerData.description}</p>
                    )}
                </div>

                {footerData.socialLinks && footerData.socialLinks.length > 0 && (
                    <div className="flex justify-center gap-4 mb-8">
                        {footerData.socialLinks.map((link, index) => {
                            const IconComponent = platformIcons[link.platform] || Instagram;
                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors"
                                >
                                    <IconComponent size={20} />
                                </a>
                            );
                        })}
                    </div>
                )}

                {footerData.quickLinks && footerData.quickLinks.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {footerData.quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                className="text-gray-300 hover:text-white text-sm transition-colors"
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                )}

                {footerData.contactInfo && (
                    <div className="space-y-3 mb-8">
                        {footerData.contactInfo.phone && (
                            <div className="flex items-center gap-2 text-gray-300">
                                <Phone size={16} />
                                <span>{footerData.contactInfo.phone}</span>
                            </div>
                        )}
                        {footerData.contactInfo.email && (
                            <div className="flex items-center gap-2 text-gray-300">
                                <Mail size={16} />
                                <span>{footerData.contactInfo.email}</span>
                            </div>
                        )}
                        {footerData.contactInfo.address && (
                            <div className="flex items-start gap-2 text-gray-300">
                                <MapPin size={16} className="mt-1" />
                                <span className="text-sm">{footerData.contactInfo.address}</span>
                            </div>
                        )}
                    </div>
                )}

                {footerData.copyrightText && (
                    <div className="pt-6 border-t border-gray-800 text-center text-gray-400 text-xs">
                        {footerData.copyrightText}
                    </div>
                )}
            </div>
        </footer>
    );
}