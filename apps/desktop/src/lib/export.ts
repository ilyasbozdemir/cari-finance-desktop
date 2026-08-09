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
  showSignatureBlock?: boolean;
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
  showSignatureBlock = true,
}: AntetPDFOptions) {
  const doc = new jsPDF();
  const companyName = useUIStore.getState().companyName || 'Genel Cari & Kasa Takibi (Demo/Beta)';

  const todayStr = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const refCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  // =========================================================
  // 1. DİNAMİK KURUMSAL ÜST ŞERİT (TOP ACCENT BARS)
  // =========================================================

  // Top Dark Navy Bar
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 6, 'F');

  // Top Sky Blue Accent Bar
  doc.setFillColor(2, 132, 199); // #0284c7
  doc.rect(0, 6, 210, 2.5, 'F');

  // =========================================================
  // 2. FİRMA ÜNVAN & KURUMSAL ANTET BAŞLIĞI
  // =========================================================

  // Company Name (Primary Bold Title)
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(companyName, 14, 18);

  // Subtitle / Sector Line
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Kurumsal Finans, Cari Hesap & Kasa Yönetim Sistemi', 14, 23.5);

  // Right Metadata Block (Tarih, Ref No)
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Tarih: ${todayStr}`, 196, 17.5, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Evrak No: ${refCode}`, 196, 23.5, { align: 'right' });

  // Divider Accent Line
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(0.6);
  doc.line(14, 27, 196, 27);

  // =========================================================
  // 3. BELGE BAŞLIĞI & AÇIKLAMA KUTUSU
  // =========================================================

  // Title Box Background
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.roundedRect(14, 31, 182, 12, 1.5, 1.5, 'F');

  // Left Accent Vertical Strip
  doc.setFillColor(2, 132, 199);
  doc.roundedRect(14, 31, 3.5, 12, 1, 1, 'F');

  // Title Text Inside Box
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), 21, 38.5);

  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(subtitle, 14, 48.5);
  }

  const startY = subtitle ? 52 : 47;

  // =========================================================
  // 4. KURUMSAL TABLO (EXECUTIVE AUTOTABLE)
  // =========================================================
  autoTable(doc, {
    startY,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42], // Dark Navy
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 3.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  let finalY = (doc as any).lastAutoTable?.finalY || startY + 20;

  // =========================================================
  // 5. MALİ ÖZET KUTUSU (SUMMARY BOX)
  // =========================================================
  if (summaryRows.length > 0) {
    if (finalY > 230) {
      doc.addPage();
      finalY = 20;
    }

    finalY += 6;
    const summaryHeight = summaryRows.length * 6.5 + 4;

    // Background Container
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(116, finalY, 80, summaryHeight, 2, 2, 'FD');

    // Left Border Strip
    doc.setFillColor(2, 132, 199);
    doc.roundedRect(116, finalY, 2.5, summaryHeight, 1, 1, 'F');

    let sumY = finalY + 5.5;
    summaryRows.forEach((item) => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${item.label}:`, 122, sumY);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(item.value, 192, sumY, { align: 'right' });
      sumY += 6.5;
    });

    finalY += summaryHeight;
  }

  // =========================================================
  // 6. KAŞE & İMZA ALANLARI (SIGNATURE BLOCKS)
  // =========================================================
  if (showSignatureBlock) {
    if (finalY > 240) {
      doc.addPage();
      finalY = 20;
    }

    finalY += 12;

    // Left Signature Box (Düzenleyen / Yetkili)
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DÜZENLEYEN / YETKİLİ İMZA & KAŞE', 14, finalY);
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.4);
    doc.line(14, finalY + 16, 85, finalY + 16);

    // Right Signature Box (Teslim Alan / Onaylayan)
    doc.text('TESLİM ALAN / ONAYLAYAN İMZA', 125, finalY);
    doc.line(125, finalY + 16, 196, finalY + 16);
  }

  // =========================================================
  // 7. KURUMSAL FOOTER & SAYFA NUMARALANDIRMA
  // =========================================================
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer Top Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, 283, 196, 283);

    // Bottom Dark Strip
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 292, 210, 5, 'F');

    // Disclaimer
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Bu evrak Cari & Kasa Finance Kurumsal sistemi tarafından dijital antetli şablon ile üretilmiştir.',
      14,
      288
    );

    // Page Number
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`Sayfa ${i} / ${pageCount}`, 196, 288, { align: 'right' });
  }

  doc.save(`${filename}.pdf`);
}
