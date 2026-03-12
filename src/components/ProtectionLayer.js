"use client";
import { useEffect } from 'react';

export default function ProtectionLayer() {
    useEffect(() => {
        // Prevent right click (context menu)
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Prevent dragging images
        const handleDragStart = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        // Prevent long press on mobile devices
        const handleTouchStart = (e) => {
            if (e.target.tagName === 'IMG') {
                // We don't preventDefault here to allow scrolling, 
                // but we rely on CSS -webkit-touch-callout: none
            }
        };

        // Prevent common keyboard shortcuts for screenshots and developer tools
        const handleKeyDown = (e) => {
            // macOS screenshot combinations: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
            const isMacScreenshot = e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key);
            
            if (e.key === 'PrintScreen' || isMacScreenshot) {
                // Clear clipboard and attempt to prevent default
                navigator.clipboard.writeText('الحماية مفعلة: يمنع أخذ لقطات شاشة.');
                try {
                    e.preventDefault();
                } catch(err) {}
            }
            
            // Deter developer tools, source code viewing, and saving
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || 
                (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || 
                (e.ctrlKey && (e.key === 'U' || e.key === 'u')) || 
                (e.ctrlKey && (e.key === 'S' || e.key === 's')) || 
                (e.ctrlKey && (e.key === 'P' || e.key === 'p'))
            ) {
                e.preventDefault();
            }
        };

        // Handle copy event
        const handleCopy = (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', 'النسخ غير مسموح.');
        };

        // Attempt to detect if app goes to background (common when taking screenshots on some mobile OS)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // If the user attempts to switch apps or open the screenshot tool,
                // we clear clipboard as a precaution. 
                // On iOS, taking a screenshot sometimes triggers a visibility change.
                try {
                    navigator.clipboard.writeText('');
                } catch(err) {}
            }
        };

        // Setup event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Inject global CSS to disable text selection and image dragging
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Old Firefox */
                -ms-user-select: none; /* IE/Edge */
                user-select: none; /* Non-prefixed version */
            }
            img {
                -webkit-user-drag: none; /* Safari */
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                pointer-events: none; /* Disables right-click and long-press explicitly on ALL images */
            }
            /* Allow clicks on specific elements that contain images but need interaction */
            button img, a img, .cursor-pointer img {
                pointer-events: auto; 
            }
        `;
        document.head.appendChild(style);

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Also a physical overlay that might help block some basic print screens
    return (
        <div 
            className="pointer-events-none fixed inset-0 z-[9999] opacity-0"
            style={{
                background: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' opacity=\'0.02\'><text x=\'20\' y=\'20\' font-size=\'20\'>Radiossa</text></svg>")'
            }}
            aria-hidden="true"
        />
    );
}
