import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRightLeft,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  Moon,
  Package,
  PieChart,
  PlusCircle,
  Settings,
  ShieldCheck,
  Sun,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { clsx } from "clsx";

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    openQuickTransaction,
    theme,
    toggleTheme,
    companyName,
    companyLogoIcon,
  } = useUIStore();

  const navItems = [
    { to: "/", label: "Ana Ekran", icon: LayoutDashboard },
    { to: "/customers", label: "Müşteri Carileri", icon: Users },
    { to: "/suppliers", label: "Tedarikçi & Satıcılar", icon: Truck },
    { to: "/inventory", label: "Stok & Ürün Takibi", icon: Package },
    { to: "/cash", label: "Kasa Takibi", icon: Wallet },
    { to: "/banks", label: "Banka Hesapları", icon: Building2 },
    { to: "/partners", label: "Ortak Hesapları", icon: PieChart },
    { to: "/transactions", label: "Tüm İşlemler", icon: ArrowRightLeft },
    { to: "/accounting", label: "Muhasebe Defteri", icon: BookOpen },
    { to: "/reports", label: "Raporlar & Ekstre", icon: FileSpreadsheet },
    { to: "/settings", label: "Sistem Ayarları", icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        "relative flex flex-col border-r transition-all duration-300 z-30 select-none shadow-md dark:shadow-2xl",
        theme === "dark"
          ? "border-slate-800/80 bg-slate-950 text-slate-200"
          : "border-slate-200 bg-white text-slate-800",
        sidebarOpen ? "w-64" : "w-16",
      )}
    >
      {/* Brand Header */}
      <div
        className={clsx(
          "flex h-14 items-center px-3 border-b border-slate-200 dark:border-slate-800/80",
          sidebarOpen ? "justify-between" : "justify-center",
        )}
      >
        {sidebarOpen
          ? (
            <>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <CompanyLogo
                  icon={companyLogoIcon}
                  className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md"
                />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white leading-none truncate">
                    {companyName || "Genel Cari & Kasa"}
                  </span>
                  <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-1">
                    Muhasebe (Demo/Beta)
                  </span>
                </div>
              </div>

              <button
                onClick={toggleSidebar}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Menüyü Daralt"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )
          : (
            <button
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md hover:scale-105 transition-transform"
              title="Menüyü Genişlet"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
      </div>

      {/* Quick Action Button */}
      <div className="p-2.5">
        <Button
          onClick={() => openQuickTransaction("sale")}
          variant="default"
          className={clsx(
            "w-full gap-2 shadow-md font-semibold bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 transition-all text-white",
            !sidebarOpen
              ? "h-10 w-10 p-0 justify-center rounded-xl"
              : "h-10 px-3",
          )}
          title={!sidebarOpen ? "+ Yeni İşlem Ekle" : undefined}
        >
          <PlusCircle className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span className="truncate">+ Yeni İşlem</span>}
        </Button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!sidebarOpen ? item.label : undefined}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all group",
                sidebarOpen ? "px-3" : "justify-center px-0 h-10 w-10 mx-auto",
                isActive
                  ? "bg-sky-500/10 dark:bg-sky-600/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100",
              )}
          >
            <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle & Footer Info */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
        <button
          onClick={toggleTheme}
          className={clsx(
            "flex items-center gap-3 w-full p-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 dark:border-slate-800",
            theme === "dark"
              ? "bg-slate-900 text-amber-400 hover:bg-slate-800"
              : "bg-slate-100 text-slate-800 hover:bg-slate-200",
            !sidebarOpen ? "h-10 w-10 justify-center p-0 mx-auto" : "px-3 py-2",
          )}
          title={theme === "dark"
            ? "Aydınlık Moduna Geç"
            : "Karanlık Moduna Geç"}
        >
          {theme === "dark"
            ? <Sun className="h-4 w-4 text-amber-400 shrink-0" />
            : <Moon className="h-4 w-4 text-slate-700 shrink-0" />}
          {sidebarOpen && (
            <span className="truncate">
              {theme === "dark" ? "Aydınlık Mod" : "Karanlık Mod"}
            </span>
          )}
        </button>

        {sidebarOpen && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 px-1 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Çift Taraflı Fiş Motoru</span>
          </div>
        )}
      </div>
    </aside>
  );
};
