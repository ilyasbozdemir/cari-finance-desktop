import React from "react";
import {
  Briefcase,
  Building2,
  Globe,
  Hammer,
  Package,
  ShoppingBag,
  Wallet,
  Wrench,
} from "lucide-react";

export type LogoIconType =
  | "building"
  | "hammer"
  | "package"
  | "shopping"
  | "briefcase"
  | "wrench"
  | "wallet"
  | "globe";

export const LOGO_OPTIONS: {
  id: LogoIconType;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "building", label: "Genel Şirket & Holding", icon: Building2 },
  { id: "hammer", label: "Mobilya & İmalat", icon: Hammer },
  { id: "package", label: "Lojistik & Depo", icon: Package },
  { id: "shopping", label: "Ticaret & Perakende", icon: ShoppingBag },
  { id: "briefcase", label: "Hizmet & Danışmanlık", icon: Briefcase },
  { id: "wrench", label: "Sanayi & Teknik Servis", icon: Wrench },
  { id: "wallet", label: "Finans & Kasa", icon: Wallet },
  { id: "globe", label: "E-Ticaret & İnternet", icon: Globe },
];

interface CompanyLogoProps {
  icon?: string;
  className?: string;
  iconClassName?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  icon = "building",
  className =
    "h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md",
  iconClassName = "h-4 w-4",
}) => {
  const selectedOption = LOGO_OPTIONS.find((opt) => opt.id === icon) ||
    LOGO_OPTIONS[0];
  const IconComponent = selectedOption.icon;

  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      <IconComponent className={iconClassName} />
    </div>
  );
};
