import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Shield, HardDrive, Building, Save, CheckCircle2, Lock, Sun, Moon, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/stores/ui.store';
import { LOGO_OPTIONS } from '@/components/common/CompanyLogo';
import { clsx } from 'clsx';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { setCompanyName, companyLogoIcon, setCompanyLogoIcon, theme, toggleTheme } = useUIStore();

  const [companyNameInput, setCompanyNameInput] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(companyLogoIcon || 'building');
  const [taxNumber, setTaxNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => window.api.auth.getSettings(),
  });

  useEffect(() => {
    if (settings) {
      setCompanyNameInput(settings.companyName || 'Genel Cari & Kasa Takibi (Demo/Beta)');
      setTaxNumber(settings.taxNumber || '');
      setAddress(settings.address || '');
      setPhone(settings.phone || '');
      setPinCode(settings.pinCode || '');
      if (settings.companyName) {
        setCompanyName(settings.companyName);
      }
    }
  }, [settings, setCompanyName]);

  const updateSettingsMutation = useMutation({
    mutationFn: (payload: any) => window.api.auth.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setCompanyName(companyNameInput);
      setCompanyLogoIcon(selectedIcon);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleBackupExport = async () => {
    try {
      const res = await window.api.backup.export();
      if (res.success && res.filePath) {
        alert(`Cari Finance Şirket Dosyası (.cari) kaydedildi:\n${res.filePath}`);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleBackupImport = async () => {
    if (confirm('DİKKAT! Seçtiğiniz .cari şirket dosyası mevcut verilerin üzerine yazılacaktır. Devam etmek istiyor musunuz?')) {
      try {
        const res = await window.api.backup.import();
        if (res.success) {
          alert('Şirket dosyası (.cari) başarıyla geri yüklendi.');
          window.location.reload();
        }
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      companyName: companyNameInput,
      taxNumber,
      address,
      phone,
      pinCode: pinCode.trim() || null,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-sky-500" />
            Firma Ayarları, İkon & Temalar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Genel özel firma muhasebesi ünvanı, logo/ikon seçimi, tema modu, güvenlik PIN kodu ve .cari dosya yönetimi.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Firma ayarları ve logosu güncellendi!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tema Ayarı */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Görünüm Tema Modu (Dark / Light)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Mevcut Tema: <span className="text-sky-600 dark:text-sky-400 font-bold capitalize">{theme === 'dark' ? 'Karanlık Mod (Dark)' : 'Aydınlık Mod (Light)'}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aydınlık veya karanlık tema seçimi.</p>
            </div>

            <Button type="button" onClick={toggleTheme} variant="outline" className="gap-2 shrink-0">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              {theme === 'dark' ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            </Button>
          </CardContent>
        </Card>

        {/* Firma Amblem & İkon Seçimi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Firma Logo & Amblem İkonu Seçimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sektörünüze veya firmanıza uygun logoyu seçin. Seçilen ikon menüde ve üst başlıkta görüntülenecektir:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {LOGO_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
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
                      'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'bg-sky-500/10 dark:bg-sky-600/20 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shrink-0 shadow-sm">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold leading-tight truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Firma Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-500" />
              Firma Ünvan & Sektör Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Firma Adı / Ünvanı *</label>
              <Input
                required
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                placeholder="Örn: ABC Ticaret & İmalat San. Ltd. Şti."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Vergi Numarası / Dairesi</label>
                <Input
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Telefon</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0212 500 00 00"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Fabrika / İmalathane / Adres</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Organize Sanayi Bölgesi 4. Cadde No: 18"
              />
            </div>
          </CardContent>
        </Card>

        {/* Giriş Şifresi / PIN Kilidi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              Uygulama Giriş Şifresi (PIN Kodu)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uygulama kilitlendiğinde istenen güvenlik PIN kodunu belirleyin. Boş bırakırsanız şifresiz açılır.
            </p>
            <div className="w-full sm:w-64">
              <Input
                type="password"
                maxLength={8}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Örn: 1234"
                className="font-mono text-base tracking-widest"
              />
            </div>
          </CardContent>
        </Card>

        {/* Veritabanı Yedekleme & Geri Yükleme (.cari) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              Özel .cari Şirket Dosyası Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Firma verilerinizi <strong>.cari</strong> şirket dosyası olarak kaydedebilir veya başka bir bilgisayardan alınan <strong>.cari</strong> dosyasını geri yükleyebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button type="button" onClick={handleBackupExport} variant="success" className="gap-2">
                <HardDrive className="w-4 h-4" />
                Şirket Dosyasını (.cari) Kaydet
              </Button>
              <Button type="button" onClick={handleBackupImport} variant="outline" className="gap-2">
                <Shield className="w-4 h-4" />
                .cari Dosyası Yükle
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="default" size="lg" className="gap-2 px-8">
            <Save className="w-4 h-4" />
            Firma Ayarlarını Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
};
