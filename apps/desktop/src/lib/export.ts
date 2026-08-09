import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useUIStore } from '@/stores/ui.store';

export interface AntetPDFOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: any[][];
  filename: string;
  summaryRows?: { label: string; value: string }[];
}

export function exportToExcel(filename: string, data: any[], sheetName = 'Rapor') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF({
  title,
  subtitle,
  headers,
  rows,
  filename,
  summaryRows = [],
}: AntetPDFOptions) {
  const doc = new jsPDF();
  const companyName = useUIStore.getState().companyName || 'Genel Cari & Kasa Takibi (Demo/Beta)';

  const todayStr = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  // ==========================================
  // DİNAMİK ANTETLİ KAĞIT HEADER (LETTERHEAD)
  // ==========================================

  // Top Antet Bar Color
  doc.setFillColor(2, 132, 199); // Sky Blue 600
  doc.rect(0, 0, 210, 8, 'F');

  // Company Name
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Dark slate
  doc.text(companyName, 14, 20);

  // Subtitle / Sector
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Cari Hesap, Kasa & Kurumsal Finans Yönetim Sistemi', 14, 26);

  // Date & Doc Info Right Aligned
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tarih: ${todayStr}`, 196, 20, { align: 'right' });
  doc.text(`Belge Kodu: RPR-${Math.floor(1000 + Math.random() * 9000)}`, 196, 26, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);

  // Document Title Box
  doc.setFontSize(13);
  doc.setTextColor(2, 132, 199);
  doc.text(title.toUpperCase(), 14, 38);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, 14, 44);
  }

  const startY = subtitle ? 48 : 42;

  // AutoTable Render
  autoTable(doc, {
    startY,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: [2, 132, 199],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  let finalY = (doc as any).lastAutoTable?.finalY || startY + 20;

  // Add Summary Rows if present
  if (summaryRows.length > 0) {
    if (finalY > 260) {
      doc.addPage();
      finalY = 20;
    }

    finalY += 6;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(120, finalY, 76, summaryRows.length * 7 + 4, 2, 2, 'F');

    let sumY = finalY + 6;
    summaryRows.forEach((item) => {
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.label}:`, 124, sumY);

      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(item.value, 192, sumY, { align: 'right' });
      sumY += 7;
    });
  }

  // ==========================================
  // DİNAMİK ANTET FOOTER
  // ==========================================
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 282, 196, 282);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Bu belge Cari & Kasa Finance sistemi tarafından dijital antetli şablon ile otomatik oluşturulmuştur.',
      14,
      287
    );
    doc.text(`Sayfa ${i} / ${pageCount}`, 196, 287, { align: 'right' });
  }

  doc.save(`${filename}.pdf`);
}
