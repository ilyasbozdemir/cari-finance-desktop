import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Plus,
  Search,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  Boxes,
  Layers,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@cari-finance/domain';

export const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [movementsOpen, setMovementsOpen] = useState(false);

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Hammadde / Malzeme');
  const [prodUnit, setProdUnit] = useState('Adet');
  const [prodPurchasePrice, setProdPurchasePrice] = useState('0');
  const [prodSalePrice, setProdSalePrice] = useState('0');
  const [prodStockQuantity, setProdStockQuantity] = useState('0');
  const [prodMinStock, setProdMinStock] = useState('5');

  // Stock Movement Form State
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [movementQty, setMovementQty] = useState('1');
  const [movementPrice, setMovementPrice] = useState('0');
  const [movementDesc, setMovementDesc] = useState('');

  // Fetch Inventory
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => window.api.inventory.list(),
  });

  // Fetch Product Movements
  const { data: movementsData } = useQuery({
    queryKey: ['stockMovements', selectedProduct?.id],
    queryFn: () => window.api.inventory.getMovements(selectedProduct!.id),
    enabled: !!selectedProduct && movementsOpen,
  });

  // Create Product Mutation
  const createProductMutation = useMutation({
    mutationFn: (payload: any) => window.api.inventory.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setAddProductOpen(false);
      setProdName('');
      setProdPurchasePrice('0');
      setProdSalePrice('0');
      setProdStockQuantity('0');
    },
  });

  // Update Stock Movement Mutation
  const updateStockMutation = useMutation({
    mutationFn: (payload: any) => window.api.inventory.updateStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      if (selectedProduct) {
        queryClient.invalidateQueries({ queryKey: ['stockMovements', selectedProduct.id] });
      }
      setStockModalOpen(false);
      setMovementQty('1');
      setMovementDesc('');
    },
  });

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Compute Total Metrics
  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc: number, p: any) => acc + (p.stockQuantity || 0), 0);
  const totalInventoryValue = products.reduce((acc: number, p: any) => acc + (p.totalStockValue || 0), 0);
  const criticalStockCount = products.filter((p: any) => p.stockQuantity <= p.minStockLevel).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    createProductMutation.mutate({
      name: prodName,
      category: prodCategory,
      unit: prodUnit,
      purchasePrice: parseFloat(prodPurchasePrice) || 0,
      salePrice: parseFloat(prodSalePrice) || 0,
      stockQuantity: parseFloat(prodStockQuantity) || 0,
      minStockLevel: parseFloat(prodMinStock) || 5,
    });
  };

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    updateStockMutation.mutate({
      productId: selectedProduct.id,
      type: movementType,
      quantity: parseFloat(movementQty) || 1,
      unitPrice: parseFloat(movementPrice) || 0,
      description: movementDesc,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-sky-400" />
            Stok & Ürün Yönetim Modülü
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hammadde, mamul ürün, yedek parça ve aksesuar stok giriş-çıkış takibi ve maliyet değerleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAddProductOpen(true)}
            variant="default"
            className="gap-2 shadow-lg shadow-sky-950/60"
          >
            <Plus className="w-4 h-4" />
            Yeni Stok Kartı Ekle
          </Button>
        </div>
      </div>

      {/* 4 Stock Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400">Toplam Ürün Kalemi</CardTitle>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Boxes className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-white">{totalProducts} Çeşit</div>
            <p className="text-[11px] text-slate-400 mt-1">Tanımlı Stok Kartı</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400">Toplam Stok Adedi</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-emerald-400">
              {totalQuantity.toLocaleString('tr-TR')} Miktar
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Depodaki Toplam Birim</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400">Toplam Stok Değeri</CardTitle>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-cyan-400">
              {formatCurrency(totalInventoryValue)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Maliyet Bazlı Depo Değeri</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400">Kritik Stok Uyarısı</CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-amber-400">{criticalStockCount} Ürün</div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum Seviyenin Altında</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <Input
            placeholder="Stok kodu veya ürün adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-900/80 border-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-slate-900 border-slate-800">
              <SelectValue placeholder="Kategori Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              <SelectItem value="Hammadde / Malzeme">Hammadde / Malzeme</SelectItem>
              <SelectItem value="Mamul Ürün">Mamul Ürün</SelectItem>
              <SelectItem value="Yarı Mamul">Yarı Mamul</SelectItem>
              <SelectItem value="Aksesuar & Parça">Aksesuar & Parça</SelectItem>
              <SelectItem value="Genel">Genel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Stok Kartları & Mevcut Depo Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stok Kodu</TableHead>
                <TableHead>Ürün / Malzeme Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Alış Fiyatı</TableHead>
                <TableHead className="text-right">Satış Fiyatı</TableHead>
                <TableHead className="text-right">Mevcut Stok</TableHead>
                <TableHead className="text-right">Stok Değeri</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                    Henüz kayıtlı stok bulunmamaktadır. "Yeni Stok Kartı Ekle" butonunu kullanın.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((prod: any) => {
                  const isCritical = prod.stockQuantity <= prod.minStockLevel;
                  return (
                    <TableRow key={prod.id}>
                      <TableCell className="font-mono font-bold text-sky-400 text-xs">
                        {prod.code}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-200">{prod.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px]">
                          {prod.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-300">
                        {formatCurrency(prod.purchasePrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-emerald-400 font-medium">
                        {formatCurrency(prod.salePrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-black text-white text-sm">
                        {prod.stockQuantity} {prod.unit}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-sky-400">
                        {formatCurrency(prod.totalStockValue)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={isCritical ? 'danger' : 'success'} className="text-[10px]">
                          {isCritical ? 'Kritik Stok' : 'Stok Yeterli'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="success"
                          className="h-8 text-xs gap-1"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setMovementType('in');
                            setMovementPrice(prod.purchasePrice.toString());
                            setStockModalOpen(true);
                          }}
                        >
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          Giriş
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 text-xs gap-1"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setMovementType('out');
                            setMovementPrice(prod.salePrice.toString());
                            setStockModalOpen(true);
                          }}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Çıkış
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setMovementsOpen(true);
                          }}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Geçmiş
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add New Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="max-w-lg bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Yeni Stok Kartı Oluştur</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Ürün / Malzeme Adı *</label>
              <Input
                required
                placeholder="Örn: 18mm Beyaz MDF Lam Plaka, Gövde Menteşesi..."
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Kategori</label>
                <Select value={prodCategory} onValueChange={setProdCategory}>
                  <SelectTrigger className="w-full bg-slate-950 border-slate-800">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hammadde / Malzeme">Hammadde / Malzeme</SelectItem>
                    <SelectItem value="Mamul Ürün">Mamul Ürün</SelectItem>
                    <SelectItem value="Yarı Mamul">Yarı Mamul</SelectItem>
                    <SelectItem value="Aksesuar & Parça">Aksesuar & Parça</SelectItem>
                    <SelectItem value="Genel">Genel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Birim</label>
                <Select value={prodUnit} onValueChange={setProdUnit}>
                  <SelectTrigger className="w-full bg-slate-950 border-slate-800">
                    <SelectValue placeholder="Birim seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adet">Adet</SelectItem>
                    <SelectItem value="Plaka">Plaka</SelectItem>
                    <SelectItem value="Metre">Metre</SelectItem>
                    <SelectItem value="Paket">Paket</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Alış Fiyatı (TL)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={prodPurchasePrice}
                  onChange={(e) => setProdPurchasePrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Satış Fiyatı (TL)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={prodSalePrice}
                  onChange={(e) => setProdSalePrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Açılış Stok Miktarı</label>
                <Input
                  type="number"
                  value={prodStockQuantity}
                  onChange={(e) => setProdStockQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Min. Kritik Stok Seviyesi</label>
                <Input
                  type="number"
                  value={prodMinStock}
                  onChange={(e) => setProdMinStock(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAddProductOpen(false)}>
                Vazgeç
              </Button>
              <Button type="submit" variant="default" disabled={createProductMutation.isPending}>
                Stok Kartını Kaydet
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Entry / Exit Dialog */}
      {selectedProduct && stockModalOpen && (
        <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
          <DialogContent className="max-w-md bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">
                Stok {movementType === 'in' ? 'Girişi (Mal Alımı)' : 'Çıkışı (Satış)'} - {selectedProduct.name}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleStockMovement} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Miktar ({selectedProduct.unit}) *</label>
                <Input
                  type="number"
                  min="0.01"
                  step="any"
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(e.target.value)}
                  className="font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Birim Fiyat (TL)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={movementPrice}
                  onChange={(e) => setMovementPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Açıklama / Fatura / İrsaliye No</label>
                <Input
                  placeholder="Örn: 100 adet depoya giriş yapıldı"
                  value={movementDesc}
                  onChange={(e) => setMovementDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setStockModalOpen(false)}>
                  Vazgeç
                </Button>
                <Button
                  type="submit"
                  variant={movementType === 'in' ? 'success' : 'destructive'}
                  disabled={updateStockMutation.isPending}
                >
                  {movementType === 'in' ? 'Stok Girişini Kaydet' : 'Stok Çıkışını Kaydet'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Product Movements History Dialog */}
      {selectedProduct && movementsOpen && (
        <Dialog open={movementsOpen} onOpenChange={setMovementsOpen}>
          <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
            <DialogHeader className="border-b border-slate-800 pb-3">
              <DialogTitle className="text-lg font-bold text-white flex items-center justify-between">
                <span>{selectedProduct.name} - Stok Hareket Geçmişi</span>
                <Badge variant="secondary" className="font-mono">
                  Mevcut: {selectedProduct.stockQuantity} {selectedProduct.unit}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto space-y-3 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Hareket Türü</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead className="text-right">Miktar</TableHead>
                    <TableHead className="text-right">Birim Fiyat</TableHead>
                    <TableHead className="text-right">Toplam Tutar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementsData?.movements?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        Bu ürüne ait stok hareketi bulunmuyor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    movementsData?.movements?.map((m: any) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs">{m.date}</TableCell>
                        <TableCell>
                          <Badge variant={m.type === 'in' ? 'success' : 'danger'}>
                            {m.type === 'in' ? 'Giriş' : 'Çıkış'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">{m.description}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-white">
                          {m.type === 'in' ? `+${m.quantity}` : `-${m.quantity}`} {selectedProduct.unit}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                          {formatCurrency(m.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-sky-400">
                          {formatCurrency(m.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
