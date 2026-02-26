"use client";

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity';

export default function LineSeparator() {
    const [lineData, setLineData] = useState(null);

    useEffect(() => {
        async function fetchLineSeparator() {
            try {
                const data = await client.fetch(`*[_type == "lineSeparator"][0]`);
                setLineData(data);
            } catch (error) {
                console.error("Error fetching line separator:", error);
            }
        }
        fetchLineSeparator();
    }, []);

    if (!lineData || !lineData.enabled) return null;

    // Default values if not specified
    const thickness = lineData.thickness || 1;
    const style = lineData.style || 'solid';
    const color = lineData.color || '#e5e7eb';
    const margin = lineData.margin || 20;

    // Convert style to CSS border style
    const borderStyle = style === 'dashed' ? 'dashed' : style === 'dotted' ? 'dotted' : 'solid';

    return (
        <div 
            className="w-full"
            style={{
                height: `${thickness}px`,
                backgroundColor: color,
                border: 'none',
                margin: `${margin}px 0`,
                borderTop: `${thickness}px ${borderStyle} ${color}`
            }}
        />
    );
}