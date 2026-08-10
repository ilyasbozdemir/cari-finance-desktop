import React from 'react';

export interface CompanyLogoProps {
  icon?: string;
  logoUrl?: string;
  className?: string;
  iconClassName?: string;
  size?: number;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  icon = 'corporate',
  logoUrl,
  className = 'h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white shadow-md',
  iconClassName,
  size = 22,
}) => {
  if (logoUrl && logoUrl.trim() !== '') {
    return (
      <div className={`flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
        <img src={logoUrl} alt="Firma Logosu" className="h-full w-full object-contain p-1" />
      </div>
    );
  }

  // High-Quality Custom Executive Vector SVGs
  const renderVectorSVG = () => {
    switch (icon) {
      case 'furniture':
      case 'hammer':
        // Modern Wood & Furniture Craftsmanship SVG Emblem
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClassName}>
            <rect x="4" y="6" width="24" height="6" rx="2" fill="currentColor" fillOpacity="0.9" />
            <path d="M7 12V24C7 25.1046 7.89543 26 9 26H23C24.1046 26 25 25.1046 25 24V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="12" x2="16" y2="26" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx="11.5" cy="18.5" r="1.5" fill="currentColor" />
            <circle cx="20.5" cy="18.5" r="1.5" fill="currentColor" />
          </svg>
        );

      case 'finance':
      case 'wallet':
        // Corporate Financial Growth Shield SVG Emblem
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClassName}>
            <path d="M16 3L27 7V15C27 21.5 22.2 27.2 16 29C9.8 27.2 5 21.5 5 15V7L16 3Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M11 17L14.5 20.5L21 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'trade':
      case 'shopping':
        // Global Trade & Commerce Hexagon SVG Emblem
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClassName}>
            <path d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M16 3V15.5M27 9.5L16 15.5M5 9.5L16 15.5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 15.5V29M27 22.5L16 15.5M5 22.5L16 15.5" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );

      case 'corporate':
      case 'building':
      default:
        // Executive Geometric Corporate Diamond SVG Emblem
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClassName}>
            <path d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M16 7L24 11.5V20.5L16 25L8 20.5V11.5L16 7Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      {renderVectorSVG()}
    </div>
  );
};

export const LOGO_OPTIONS = [
  { id: 'corporate', label: 'Kurumsal Elmas SVG Simgesi' },
  { id: 'furniture', label: 'Mobilya & Ahşap İmalat SVG' },
  { id: 'finance', label: 'Finans & Güvenlik Kalkanı SVG' },
  { id: 'trade', label: 'Ticaret & Altıgen Lojistik SVG' },
  { id: 'building', label: 'Genel Şirket & Holding' },
  { id: 'hammer', label: 'Ahşap & İmalathane' },
  { id: 'wallet', label: 'Finans & Kasa' },
  { id: 'shopping', label: 'Perakende & Mağaza' },
];
