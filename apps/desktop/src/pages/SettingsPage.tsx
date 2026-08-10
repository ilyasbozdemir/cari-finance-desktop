import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings as SettingsIcon,
  Building,
  Save,
  Database,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CompanyLogo, LOGO_OPTIONS } from '@/components/common/CompanyLogo';
import { useUIStore } from '@/stores/ui.store';
import { clsx } from 'clsx';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    theme,
    toggleTheme,
    companyName,
    companyLogoIcon,
    setCompanyName,
    setCompanyLogoIcon,
  } = useUIStore();

  const [nameInput, setNameInput] = useState(companyName || '');
  const [taxNumber, setTaxNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(companyLogoIcon || 'corporate');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: dbSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const data = await window.api.auth.getSettings();
      if (data) {
        if (data.companyName) {
          setNameInput(data.companyName);
          setCompanyName(data.companyName);
        }
        if (data.taxNumber) setTaxNumber(data.taxNumber);
        if (data.address) setAddress(data.address);
        if (data.phone) setPhone(data.phone);
      }
      return data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (payload: any) => window.api.auth.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setCompanyName(nameInput);
      setCompanyLogoIcon(selectedIcon);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      companyName: nameInput,
      taxNumber,
      address,
      phone,
    });
  };

  const handleBackupExport = async () => {
    try {
      const res = await window.api.backup.export();
      if (res.success) {
        alert(`Yedekleme Başarılı!\nDosya Konumu: ${res.filePath}`);
      }
    } catch (err: any) {
      alert(`Yedekleme Hatası: ${err.message}`);
    }
  };

  const handleBackupImport = async () => {
    if (confirm('DİKKAT! Yedekten geri yükleme yapıldığında mevcut veriler ezilecektir. Devam etmek istiyor musunuz?')) {
      try {
        const res = await window.api.backup.import();
        if (res.success) {
          alert('Veritabanı yedekten başarıyla yüklendi! Sayfa yenileniyor...');
          window.location.reload();
        }
      } catch (err: any) {
        alert(`Geri Yükleme Hatası: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-sky-500" />
            Sistem & Şirket Ayarları
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Firma unvanı, vektörel kurumsal logo seçimi, veritabanı `.cari` yedekleme ve görünüm teması.
          </p>
        </div>

        {savedSuccess && (
          <Badge variant="success" className="gap-1 animate-pulse py-1 px-3">
            <CheckCircle2 className="w-4 h-4" /> Değişiklikler Kaydedildi!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Company Profile & Logo Selector */}
        <div className="md:col-span-2 space-y-6">
          {/* Company Profile Card */}
          <Card>
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-500" />
                Firma Bilgileri & Kurumsal Ünvan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSaveCompanyInfo} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Firma Unvanı (Ekstre ve Raporlarda Çıkar) *
                  </label>
                  <Input
                    required
                    placeholder="Örn: ABC Mobilya İmalat Sanayi Ltd. Şti."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Vergi Dairesi / No</label>
                    <Input
                      placeholder="İnegöl V.D. / 1234567890"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Telefon / İletişim</label>
                    <Input
                      placeholder="0224 715 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Fabrika / Adres Bilgisi</label>
                  <Input
                    placeholder="Organize Sanayi Bölgesi 4. Cadde No: 18 İnegöl / BURSA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateSettingsMutation.isPending} className="gap-2 text-xs font-semibold">
                    <Save className="w-4 h-4" />
                    {updateSettingsMutation.isPending ? 'Kaydediliyor...' : 'Firma Bilgilerini Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Vektörel Kurumsal Logo Seçimi */}
          <Card>
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-bold">Vektörel Kurumsal Logo Simgesi</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sektörünüze uygun vektörel amblem seçin. Seçilen logo yan menüde ve üst başlıkta görüntülenecektir:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {LOGO_OPTIONS.map((opt) => {
                  const isSelected = selectedIcon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(opt.id);
                        setCompanyLogoIcon(opt.id);
                      }}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'bg-sky-500/10 dark:bg-sky-600/20 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      )}
                    >
                      <CompanyLogo icon={opt.id} className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shrink-0 shadow-sm" />
                      <span className="text-xs font-semibold truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Backup, Restore & Theme */}
        <div className="space-y-6">
          {/* Appearance / Theme Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Görünüm & Tema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Uygulama Teması</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Light / Dark göz koruma modu</p>
                </div>

                <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2 text-xs">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      Aydınlık
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-sky-500" />
                      Karanlık
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Restore Card */}
          <Card className="border-sky-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-500" />
                Özel `.cari` Veritabanı Yedeği
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tüm cari hesap hareketlerinizi tek tıkla şifreli <strong>.cari</strong> dosyası olarak bilgisayarınıza indirebilir veya geri yükleyebilirsiniz.
              </p>

              <div className="space-y-2 pt-2">
                <Button variant="default" onClick={handleBackupExport} className="w-full gap-2 text-xs font-semibold">
                  <Download className="w-4 h-4" />
                  Yedek Al (.cari İndir)
                </Button>

                <Button variant="outline" onClick={handleBackupImport} className="w-full gap-2 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10">
                  <Upload className="w-4 h-4" />
                  Yedekten Geri Yükle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Banner */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <Lock className="w-4 h-4" /> Güvenlik & Yerel SQLite
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Verileriniz yerel bilgisayarınızda SQLite veritabanında saklanır. Şifreli bulut senkronizasyonu veya PIN koruması açıktır.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
