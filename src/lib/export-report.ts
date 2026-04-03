import type { Debt, Transaction } from "@/types";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { netProfit, sumExpenses, sumSales } from "@/lib/profit";

/** CSV download helper — replace with `POST /v1/exports` for server-generated files */
export function downloadTransactionsCsv(transactions: Transaction[], filename: string) {
  const rows = [
    ["date", "type", "amount", "product", "customer", "note"].join(","),
    ...transactions.map((t) =>
      [
        format(new Date(t.createdAt), "yyyy-MM-dd HH:mm"),
        t.type,
        t.amount,
        escapeCsv(t.product ?? ""),
        escapeCsv(t.customerName ?? ""),
        escapeCsv(t.note ?? ""),
      ].join(",")
    ),
  ];
  downloadBlob(rows.join("\n"), filename, "text/csv;charset=utf-8");
}

export function downloadDebtsCsv(debts: Debt[], filename: string) {
  const rows = [
    ["customer", "amount", "due", "paid", "note"].join(","),
    ...debts.map((d) =>
      [
        escapeCsv(d.customerName),
        d.amount,
        format(new Date(d.dueDate), "yyyy-MM-dd"),
        d.paid ? "yes" : "no",
        escapeCsv(d.note ?? ""),
      ].join(",")
    ),
  ];
  downloadBlob(rows.join("\n"), filename, "text/csv;charset=utf-8");
}

function escapeCsv(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadProfitPdf(transactions: Transaction[], title: string) {
  const doc = new jsPDF();
  const margin = 14;
  let y = 18;
  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 10;
  doc.setFontSize(11);
  const sales = sumSales(transactions);
  const expenses = sumExpenses(transactions);
  const profit = netProfit(transactions);
  doc.text(`Sales: ${sales.toLocaleString()} Birr`, margin, y);
  y += 7;
  doc.text(`Expenses: ${expenses.toLocaleString()} Birr`, margin, y);
  y += 7;
  doc.setTextColor(profit >= 0 ? 16 : 239, profit >= 0 ? 185 : 68, profit >= 0 ? 129 : 68);
  doc.text(`Net profit: ${profit.toLocaleString()} Birr`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 14;
  doc.setFontSize(10);
  doc.text("Recent lines", margin, y);
  y += 6;
  for (const t of transactions.slice(0, 25)) {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }
    const line = `${format(new Date(t.createdAt), "MM-dd")} ${t.type} ${t.amount} ${t.product ?? ""}`;
    doc.text(line.slice(0, 90), margin, y);
    y += 5;
  }
  doc.save(`zayride-report-${format(new Date(), "yyyyMMdd-HHmm")}.pdf`);
}
