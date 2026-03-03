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

    // Default colors if not specified
    const backgroundColor = footerData.backgroundColor || '#1f2937'; // gray-800
    const textColor = footerData.textColor || '#ffffff';
    const iconColor = footerData.iconColor || '#ffffff';

    // Default alignments if not specified
    const titleAlignment = footerData.titleAlignment || 'center';
    const descriptionAlignment = footerData.descriptionAlignment || 'center';
    const socialLinksAlignment = footerData.socialLinksAlignment || 'center';
    const quickLinksAlignment = footerData.quickLinksAlignment || 'left';
    const contactInfoAlignment = footerData.contactInfoAlignment || 'left';
    const copyrightAlignment = footerData.copyrightAlignment || 'center';

    return (
        <footer
            className="py-12 px-4 mt-0 pt-0"
            style={{ backgroundColor: backgroundColor }}
        >
            <div className="max-w-md mx-auto">
                <div
                    className="mb-0 pb-0"
                    style={{ textAlign: titleAlignment }}
                >
                    {footerData.subLogo && (
                        <div className="flex justify-center mb-0 pb-0">
                            <img
                                src={urlFor(footerData.subLogo).url()}
                                alt="Footer Sub Logo"
                                style={{
                                    width: footerData.subLogoWidth ? `${footerData.subLogoWidth}px` : '60px',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    )}
                    {footerData.title && (
                        <h2
                            className="text-2xl font-bold mb-0 mt-0"
                            style={{ color: textColor }}
                        >
                            {footerData.title}
                        </h2>
                    )}
                    {footerData.description && (
                        <p
                            className="text-sm"
                            style={{
                                color: textColor,
                                textAlign: descriptionAlignment
                            }}
                        >
                            {footerData.description}
                        </p>
                    )}
                </div>

                {footerData.socialLinks && footerData.socialLinks.length > 0 && (
                    <div
                        className="flex gap-4 mb-8"
                        style={{ justifyContent: socialLinksAlignment === 'center' ? 'center' : socialLinksAlignment === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                        {footerData.socialLinks.map((link, index) => {
                            const IconComponent = platformIcons[link.platform] || Instagram;
                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full transition-colors"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                >
                                    <IconComponent
                                        size={20}
                                        style={{ color: iconColor }}
                                    />
                                </a>
                            );
                        })}
                    </div>
                )}

                {footerData.quickLinks && footerData.quickLinks.length > 0 && (
                    <div
                        className="grid grid-cols-2 gap-4 mb-8"
                        style={{ justifyContent: quickLinksAlignment === 'center' ? 'center' : quickLinksAlignment === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                        {footerData.quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                className="text-sm transition-colors"
                                style={{
                                    color: textColor,
                                    textAlign: quickLinksAlignment
                                }}
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                )}

                {footerData.contactInfo && (
                    <div
                        className="space-y-3 mb-8"
                        style={{ textAlign: contactInfoAlignment }}
                    >
                        {footerData.contactInfo.phone && (
                            <div
                                className="flex items-center gap-2"
                                style={{
                                    color: textColor,
                                    justifyContent: contactInfoAlignment === 'center' ? 'center' : contactInfoAlignment === 'right' ? 'flex-end' : 'flex-start',
                                    display: 'flex'
                                }}
                            >
                                <Phone
                                    size={16}
                                    style={{ color: iconColor }}
                                />
                                <span>{footerData.contactInfo.phone}</span>
                            </div>
                        )}
                        {footerData.contactInfo.email && (
                            <div
                                className="flex items-center gap-2"
                                style={{
                                    color: textColor,
                                    justifyContent: contactInfoAlignment === 'center' ? 'center' : contactInfoAlignment === 'right' ? 'flex-end' : 'flex-start',
                                    display: 'flex'
                                }}
                            >
                                <Mail
                                    size={16}
                                    style={{ color: iconColor }}
                                />
                                <span>{footerData.contactInfo.email}</span>
                            </div>
                        )}
                        {footerData.contactInfo.address && (
                            <div
                                className="flex items-start gap-2"
                                style={{
                                    color: textColor,
                                    justifyContent: contactInfoAlignment === 'center' ? 'center' : contactInfoAlignment === 'right' ? 'flex-end' : 'flex-start',
                                    display: 'flex'
                                }}
                            >
                                <MapPin
                                    size={16}
                                    className="mt-1"
                                    style={{ color: iconColor }}
                                />
                                <span className="text-sm">{footerData.contactInfo.address}</span>
                            </div>
                        )}
                    </div>
                )}

                {footerData.copyrightText && (
                    <div
                        className="pt-6 border-t"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            color: textColor,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textAlign: copyrightAlignment
                        }}
                    >
                        {footerData.copyrightText}
                        <div className="mt-2 flex justify-center items-center gap-1 opacity-80 font-bold">
                            <span>Powered BY</span>
                            <a
                                href="https://www.instagram.com/nadjem__eddine/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent"
                            >
                                Nadjem Eddine
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
}