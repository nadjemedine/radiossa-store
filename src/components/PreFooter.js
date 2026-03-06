"use client";

import { useState, useEffect } from 'react';
import { client, urlFor } from '@/lib/sanity';
import { Package, Truck, ShieldCheck, Star } from 'lucide-react';

const defaultIcons = {
    1: Package,
    2: Truck,
    3: ShieldCheck,
    4: Star,
};

export default function PreFooter() {
    const [preFooterData, setPreFooterData] = useState(null);

    useEffect(() => {
        async function fetchPreFooter() {
            try {
                const data = await client.fetch(`*[_type == "preFooter"][0]`);
                setPreFooterData(data);
            } catch (error) {
                console.error("Error fetching pre-footer:", error);
            }
        }
        fetchPreFooter();
    }, []);

    if (!preFooterData || !preFooterData.enabled) return null;

    const rectangles = [
        preFooterData.rectangle1,
        preFooterData.rectangle2,
        preFooterData.rectangle3,
        preFooterData.rectangle4
    ];

    // Default background color if not specified
    const backgroundColor = preFooterData.backgroundColor || '#f3f4f6';

    return (
        <div
            className="py-8 md:py-16 px-4"
            style={{ backgroundColor }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {rectangles.map((rect, index) => {
                        if (!rect) return null;

                        const IconComponent = rect.icon ?
                            ((rect.icon.asset && rect.icon.asset._ref) ?
                                undefined : defaultIcons[index + 1]) :
                            defaultIcons[index + 1];

                        // Default colors if not specified
                        const rectBgColor = rect.backgroundColor || '#ffffff';
                        const rectTextColor = rect.textColor || '#000000';
                        const rectIconColor = rect.iconColor || '#000000';

                        // Calculate width based on percentage
                        const colSpan = rect.widthPercentage ?
                            Math.max(1, Math.min(4, Math.round(rect.widthPercentage / 25))) :
                            1;

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center justify-center p-6 md:p-10 rounded-2xl text-center col-span-${colSpan} shadow-sm transition-all hover:shadow-md`}
                                style={{
                                    backgroundColor: rectBgColor,
                                    color: rectTextColor,
                                }}
                            >
                                {rect.icon && rect.icon.asset && rect.icon.asset._ref ? (
                                    <img
                                        src={urlFor(rect.icon).width(rect.iconSize || 60).height(rect.iconSize || 60).url()}
                                        alt={rect.title || `Icon ${index + 1}`}
                                        className="mb-4 object-contain"
                                        style={{
                                            width: `${rect.iconSize ? rect.iconSize * 1.5 : 60}px`,
                                            height: `${rect.iconSize ? rect.iconSize * 1.5 : 60}px`
                                        }}
                                    />
                                ) : (
                                    <IconComponent
                                        size={rect.iconSize ? rect.iconSize * 1.5 : 60}
                                        className="mb-4"
                                        style={{ color: rectIconColor }}
                                    />
                                )}
                                {rect.title && (
                                    <h3
                                        className="font-bold text-base md:text-xl mb-2"
                                        style={{ color: rectTextColor }}
                                    >
                                        {rect.title}
                                    </h3>
                                )}
                                {rect.subtitle && (
                                    <p
                                        className="text-xs md:text-sm opacity-80"
                                        style={{ color: rectTextColor }}
                                    >
                                        {rect.subtitle}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}