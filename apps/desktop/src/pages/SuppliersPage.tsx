import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@cari-finance/domain";
import { useUIStore } from "@/stores/ui.store";
import { exportToExcel, exportToPDF } from "@/lib/export";

export const SuppliersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { openQuickTransaction } = useUIStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null,
  );
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);

  // New Supplier Form State
  const [newSuppName, setNewSuppName] = useState("");
  const [newSuppPhone, setNewSuppPhone] = useState("");
  const [newSuppTax, setNewSuppTax] = useState("");
  const [newSuppAddress, setNewSuppAddress] = useState("");
  const [newSuppNotes, setNewSuppNotes] = useState("");

  // Fetch Suppliers List
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => window.api.suppliers.list(),
  });

  // Fetch Single Supplier Statement
  const { data: supplierStatement } = useQuery({
    queryKey: ["supplierStatement", selectedSupplierId],
    queryFn: () => window.api.suppliers.getStatement(selectedSupplierId!),
    enabled: !!selectedSupplierId,
  });

  // Create Supplier Mutation
  const createSupplierMutation = useMutation({
    mutationFn: (payload: any) => window.api.suppliers.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setAddSupplierOpen(false);
      setNewSuppName("");
      setNewSuppPhone("");
      setNewSuppTax("");
      setNewSuppAddress("");
      setNewSuppNotes("");
    },
  });

  const filteredSuppliers = suppliers.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)),
  );

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppName.trim()) return;
    createSupplierMutation.mutate({
      name: newSuppName,
      phone: newSuppPhone,
      taxNumber: newSuppTax,
      address: newSuppAddress,
      notes: newSuppNotes,
    });
  };

  const handleExportPDF = () => {
    if (!supplierStatement) return;
    const headers = [
      "Tarih",
      "Belge No",
      "İşlem Açıklaması",
      "Alacak (Alım TL)",
      "Borç (Ödeme TL)",
      "Bakiye TL",
    ];
    const rows = supplierStatement.movements.map((m: any) => [
      m.date,
      m.docNumber || "-",
      m.description,
      m.credit > 0 ? formatCurrency(m.credit) : "-",
      m.debit > 0 ? formatCurrency(m.debit) : "-",
      formatCurrency(m.balance),
    ]);

    exportToPDF({
      title:
        `${supplierStatement.supplier.name} - Tedarikçi Cari Hesap Ekstresi`,
      subtitle: `Tel: ${supplierStatement.supplier.phone || "-"} | Vergi No: ${
        supplierStatement.supplier.taxNumber || "-"
      } | Adres: ${supplierStatement.supplier.address || "-"}`,
      headers,
      rows,
      filename: `tedarikci_ekstre_${
        supplierStatement.supplier.name.replace(/\s+/g, "_")
      }`,
      summaryRows: [
        {
          label: "Toplam Alım (Borcumuz)",
          value: formatCurrency(supplierStatement.totalCredit),
        },
        {
          label: "Toplam Ödeme (Tedarikçiye Yapılan)",
          value: formatCurrency(supplierStatement.totalDebit),
        },
        {
          label: "Güncel Kapanış Bakiyesi",
          value: formatCurrency(supplierStatement.currentBalance),
        },
      ],
    });
  };

  const handleExportExcel = () => {
    if (!supplierStatement) return;
    const data = supplierStatement.movements.map((m: any) => ({
      Tarih: m.date,
      "Belge No": m.docNumber || "-",
      Açıklama: m.description,
      "Alacak (Alım TL)": m.credit,
      "Borç (Ödeme TL)": m.debit,
      "Yürüyen Bakiye TL": m.balance,
    }));
    exportToExcel(
      `tedarikci_ekstre_${
        supplierStatement.supplier.name.replace(/\s+/g, "_")
      }`,
      data,
      "Cari Ekstre",
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-sky-500" />
            Tedarikçi & Satıcı Carileri
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tüm tedarikçi kartları, hammadde/mal alımları, yapılan ödemeler ve
            tedarikçi ekstreleri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAddSupplierOpen(true)}
            variant="default"
            className="gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Tedarikçi Ekle
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <Input
            placeholder="Tedarikçi adı veya telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Toplam Kayıtlı Tedarikçi:{" "}
          <span className="text-sky-500 font-bold">{suppliers.length}</span>
        </div>
      </div>

      {/* Suppliers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supp: any) => {
          const isCreditor = supp.balance > 0;
          return (
            <Card key={supp.id} className="relative overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">
                      {supp.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {supp.phone || "Telefon Yok"}
                    </p>
                  </div>
                  <Badge
                    variant={isCreditor ? "danger" : "secondary"}
                    className="font-mono text-[10px]"
                  >
                    {isCreditor
                      ? `Borcumuz Var (${formatCurrency(supp.balance)})`
                      : "Bakiye Yok"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                      Toplam Alım (Alacak)
                    </span>
                    <span className="font-mono font-bold text-rose-500">
                      {formatCurrency(supp.totalCredit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                      Yapılan Ödeme (Borç)
                    </span>
                    <span className="font-mono font-bold text-emerald-500">
                      {formatCurrency(supp.totalDebit)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      Güncel Kapanış Bakiyesi
                    </span>
                    <span className="font-mono text-base font-black text-sky-500">
                      {formatCurrency(supp.balance)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-8 text-xs"
                      onClick={() => setSelectedSupplierId(supp.id)}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ekstre Gör
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1 h-8 text-xs"
                      onClick={() => openQuickTransaction("payment")}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Ödeme Yap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Supplier Statement Dialog */}
      {selectedSupplierId && supplierStatement && (
        <Dialog
          open={!!selectedSupplierId}
          onOpenChange={() => setSelectedSupplierId(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {supplierStatement.supplier.name} - Tedarikçi Cari Ekstresi
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {supplierStatement.supplier.address ||
                      "Adres belirtilmemiş"} • Tel:{" "}
                    {supplierStatement.supplier.phone || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportExcel}
                    className="gap-1.5 text-xs"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Excel İndir
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleExportPDF}
                    className="gap-1.5 text-xs"
                  >
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
                    <TableHead>İşlem Açıklaması</TableHead>
                    <TableHead className="text-right">
                      Alım (Alacak TL)
                    </TableHead>
                    <TableHead className="text-right">
                      Ödeme (Borç TL)
                    </TableHead>
                    <TableHead className="text-right">Yürüyen Bakiye</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierStatement.movements.length === 0
                    ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-slate-500"
                        >
                          Bu tedarikçiye ait henüz cari hareket bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )
                    : (
                      supplierStatement.movements.map((mov: any) => (
                        <TableRow key={mov.id}>
                          <TableCell className="font-mono text-xs">
                            {mov.date}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-mono text-[11px]"
                            >
                              {mov.docNumber || "İşlem"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                            {mov.description}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-rose-500">
                            {mov.credit > 0 ? formatCurrency(mov.credit) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-emerald-500">
                            {mov.debit > 0 ? formatCurrency(mov.debit) : "-"}
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

      {/* Add New Supplier Dialog */}
      <Dialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Yeni Tedarikçi Kartı Oluştur
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSupplier} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Tedarikçi / Firma Adı *
              </label>
              <Input
                required
                placeholder="Örn: Kereste & Malzeme San. A.Ş."
                value={newSuppName}
                onChange={(e) => setNewSuppName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Telefon Numarası
              </label>
              <Input
                placeholder="0224 000 00 00"
                value={newSuppPhone}
                onChange={(e) => setNewSuppPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Vergi No / Vergi Dairesi
              </label>
              <Input
                placeholder="1234567890"
                value={newSuppTax}
                onChange={(e) => setNewSuppTax(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Adres
              </label>
              <Input
                placeholder="Organize Keresteciler Sit..."
                value={newSuppAddress}
                onChange={(e) => setNewSuppAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Notlar
              </label>
              <Input
                placeholder="Hammadde tedarikçisi vb."
                value={newSuppNotes}
                onChange={(e) => setNewSuppNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddSupplierOpen(false)}
              >
                Vazgeç
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={createSupplierMutation.isPending}
              >
                Tedarikçiyi Kaydet
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
