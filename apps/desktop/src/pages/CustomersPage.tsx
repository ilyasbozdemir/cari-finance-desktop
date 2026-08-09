import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Search, FileSpreadsheet, ArrowDownLeft, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@cari-finance/domain';
import { useUIStore } from '@/stores/ui.store';
import { exportToPDF, exportToExcel } from '@/lib/export';

export const CustomersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustTax, setNewCustTax] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Fetch Customers List
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => window.api.customers.list(),
  });

  // Fetch Single Customer Statement
  const { data: customerStatement } = useQuery({
    queryKey: ['customerStatement', selectedCustomerId],
    queryFn: () => window.api.customers.getStatement(selectedCustomerId!),
    enabled: !!selectedCustomerId,
  });

  // Create Customer Mutation
  const createCustomerMutation = useMutation({
    mutationFn: (payload: any) => window.api.customers.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setAddCustomerOpen(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustTax('');
      setNewCustAddress('');
      setNewCustNotes('');
    },
  });

  const filteredCustomers = customers.filter(
    (c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    createCustomerMutation.mutate({
      name: newCustName,
      phone: newCustPhone,
      taxNumber: newCustTax,
      address: newCustAddress,
      notes: newCustNotes,
    });
  };

  const handleExportPDF = () => {
    if (!customerStatement) return;
    const headers = ['Tarih', 'Belge No', 'İşlem Açıklaması', 'Borç (Satış TL)', 'Alacak (Tahsilat TL)', 'Bakiye TL'];
    const rows = customerStatement.movements.map((m: any) => [
      m.date,
      m.docNumber || '-',
      m.description,
      m.debit > 0 ? formatCurrency(m.debit) : '-',
      m.credit > 0 ? formatCurrency(m.credit) : '-',
      formatCurrency(m.balance),
    ]);

    exportToPDF({
      title: `${customerStatement.customer.name} - Müşteri Cari Hesap Ekstresi`,
      subtitle: `Tel: ${customerStatement.customer.phone || '-'} | Vergi No: ${customerStatement.customer.taxNumber || '-'} | Adres: ${customerStatement.customer.address || '-'}`,
      headers,
      rows,
      filename: `musteri_ekstre_${customerStatement.customer.name.replace(/\s+/g, '_')}`,
      summaryRows: [
        { label: 'Toplam Satış (Borç)', value: formatCurrency(customerStatement.totalDebit) },
        { label: 'Toplam Tahsilat (Alacak)', value: formatCurrency(customerStatement.totalCredit) },
        { label: 'Güncel Kapanış Bakiyesi', value: formatCurrency(customerStatement.currentBalance) },
      ],
    });
  };

  const handleExportExcel = () => {
    if (!customerStatement) return;
    const data = customerStatement.movements.map((m: any) => ({
      Tarih: m.date,
      'Belge No': m.docNumber || '-',
      Açıklama: m.description,
      'Borç (Satış TL)': m.debit,
      'Alacak (Tahsilat TL)': m.credit,
      'Yürüyen Bakiye TL': m.balance,
    }));
    exportToExcel(`musteri_ekstre_${customerStatement.customer.name.replace(/\s+/g, '_')}`, data, 'Cari Ekstre');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-500" />
            Müşteri Cari Hesapları
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tüm müşteri kartları, cari hareketler, borç/alacak bakiyeleri ve antetli müşteri ekstreleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setAddCustomerOpen(true)} variant="default" className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Yeni Müşteri Ekle
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <Input
            placeholder="Müşteri adı veya telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Toplam Kayıtlı Müşteri: <span className="text-sky-500 font-bold">{customers.length}</span>
        </div>
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust: any) => {
          const isDebtor = cust.balance > 0;
          return (
            <Card key={cust.id} className="relative overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">{cust.name}</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cust.phone || 'Telefon Yok'}
                    </p>
                  </div>
                  <Badge variant={isDebtor ? 'danger' : 'secondary'} className="font-mono text-[10px]">
                    {isDebtor ? `Borçlu (${formatCurrency(cust.balance)})` : 'Bakiye Yok'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Toplam Borç (Satış)</span>
                    <span className="font-mono font-bold text-rose-500">{formatCurrency(cust.totalDebit)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Toplam Alacak (Ödeme)</span>
                    <span className="font-mono font-bold text-emerald-500">{formatCurrency(cust.totalCredit)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Güncel Bakiye</span>
                    <span className="font-mono text-base font-black text-sky-500">
                      {formatCurrency(cust.balance)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-8 text-xs"
                      onClick={() => setSelectedCustomerId(cust.id)}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ekstre Gör
                    </Button>

                    <Button
                      size="sm"
                      variant="success"
                      className="gap-1 h-8 text-xs"
                      onClick={() => openQuickTransaction('collection')}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      Tahsilat Al
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customer Statement Dialog / Detailed Ledger View */}
      {selectedCustomerId && customerStatement && (
        <Dialog open={!!selectedCustomerId} onOpenChange={() => setSelectedCustomerId(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {customerStatement.customer.name} - Cari Hesap Ekstresi
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {customerStatement.customer.address || 'Adres belirtilmemiş'} • Tel: {customerStatement.customer.phone || '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleExportExcel} className="gap-1.5 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Excel İndir
                  </Button>
                  <Button size="sm" variant="default" onClick={handleExportPDF} className="gap-1.5 text-xs">
                    <Download className="w-4 h-4 text-sky-400" />
                    Antetli PDF İndir
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Belge No</TableHead>
                    <TableHead>İşlem / Ürün Açıklaması</TableHead>
                    <TableHead className="text-right">Borç (Satış)</TableHead>
                    <TableHead className="text-right">Alacak (Tahsilat)</TableHead>
                    <TableHead className="text-right">Yürüyen Bakiye</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerStatement.movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        Bu müşteriye ait henüz cari hareket bulunmamaktadır.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerStatement.movements.map((mov: any) => (
                      <TableRow key={mov.id}>
                        <TableCell className="font-mono text-xs">{mov.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-[11px]">
                            {mov.docNumber || 'İşlem'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-slate-800 dark:text-slate-200">{mov.description}</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-rose-500">
                          {mov.debit > 0 ? formatCurrency(mov.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-500">
                          {mov.credit > 0 ? formatCurrency(mov.credit) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-sky-500">
                          {formatCurrency(mov.balance)}
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

      {/* Add New Customer Dialog */}
      <Dialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Yeni Müşteri Kartı Oluştur</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Müşteri / Firma Adı *</label>
              <Input
                required
                placeholder="Örn: ABC Ticaret & Sanayi"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Telefon Numarası</label>
              <Input
                placeholder="0532 000 00 00"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Vergi No / T.C. No</label>
              <Input
                placeholder="1234567890"
                value={newCustTax}
                onChange={(e) => setNewCustTax(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Adres</label>
              <Input
                placeholder="Sanayi Bölgesi No: 12..."
                value={newCustAddress}
                onChange={(e) => setNewCustAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Notlar</label>
              <Input
                placeholder="Genel cari notlar..."
                value={newCustNotes}
                onChange={(e) => setNewCustNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAddCustomerOpen(false)}>
                Vazgeç
              </Button>
              <Button type="submit" variant="default" disabled={createCustomerMutation.isPending}>
                Müşteriyi Kaydet
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
