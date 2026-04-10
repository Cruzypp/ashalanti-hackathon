import type { Transaction } from "@/app/components-cruz/dashboard/PurchaseHistory";

function formatAmount(amount: number): string {
  return `$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export async function exportPurchasesPDF(gastos: Transaction[], monthKey?: string | null) {
  const filtered = monthKey
    ? gastos.filter((t) => t.date.startsWith(monthKey))
    : gastos;
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const totalGasto = filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Header bar
  doc.setFillColor(13, 165, 233);
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const periodLabel = monthKey
    ? new Date(monthKey + "-01").toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    : "Todos los meses";
  doc.text(`Historial de Compras — ${periodLabel}`, 14, 13);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const generated = new Date().toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
  });
  doc.text(`Generado el ${generated}`, 297 - 14, 13, { align: "right" });

  // Table
  autoTable(doc, {
    startY: 28,
    head: [["#", "Comercio / Proveedor", "Categoría", "Banco", "Tarjeta", "Fecha", "Monto"]],
    body: filtered.map((t, i) => [
      i + 1,
      t.merchant,
      t.subcategory ? `${t.category} · ${t.subcategory}` : t.category,
      t.bank,
      `···· ${t.card_last4}`,
      formatDate(t.date),
      formatAmount(t.amount),
    ]),
    foot: [["", "", "", "", "", "Total gastado", `$${totalGasto.toLocaleString("en-US", { minimumFractionDigits: 2 })}`]],
    styles: { fontSize: 9, cellPadding: 4, font: "helvetica" },
    headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: "bold", halign: "left" },
    footStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39], fontStyle: "bold" },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      6: { halign: "right", cellWidth: 28 },
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    didParseCell(data) {
      if (data.column.index === 6 && data.section === "body") {
        data.cell.styles.textColor = [239, 68, 68];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Page footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Friction Map · Página ${p} de ${pageCount}`, 297 / 2, 205, { align: "center" });
  }

  doc.save(`compras_${new Date().toISOString().slice(0, 10)}.pdf`);
}
