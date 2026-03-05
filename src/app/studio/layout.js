"use client";

export default function StudioLayout({ children }) {
  return (
    <div className="sanity-studio-container">
      {children}
      <style>{`
        /* Hide global layout elements in Studio */
        nav, footer, .pre-footer, .line-separator {
          display: none !important;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
