'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/utils';
import { X, Printer, CheckCircle, Sparkles } from 'lucide-react';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
}) => {
  const { invoices, settings } = useApp();

  const invoice = invoices.find((i) => i.id === invoiceId);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNumber = `${settings.receiptPrefix || 'REC-'}${invoice.invoiceNumber.replace(/[^0-9]/g, '') || '001'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none my-8">
        {/* Modal Controls - hidden when printing */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Tuition Fee Payment Voucher
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-8 bg-white text-gray-900 font-sans print:p-6 relative">
          {/* Watermark for paid status */}
          {invoice.status === 'Paid' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-9xl font-black uppercase text-emerald-600 transform -rotate-12 select-none">
                PAID
              </span>
            </div>
          )}

          {/* Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                  {settings.instituteName}
                </h1>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {settings.tagline || 'Excellence in Coaching & Academy Education'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-sm">
                {settings.address} &bull; Tel: {settings.phone}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                Fee Receipt
              </span>
              <div className="text-xs text-gray-500">
                Receipt #: <span className="font-mono font-bold text-gray-900">{receiptNumber}</span>
              </div>
              <div className="text-xs text-gray-500">
                Date: <span className="font-medium text-gray-900">{formatDate(invoice.paymentDate || invoice.dueDate)}</span>
              </div>
            </div>
          </div>

          {/* Recipient & Billing info */}
          <div className="grid grid-cols-2 gap-4 py-5 border-b border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] block mb-1">
                Student Details
              </span>
              <div className="font-bold text-base text-gray-900">{invoice.studentName}</div>
              <div className="text-gray-600 font-mono mt-0.5">Roll No: {invoice.studentRoll}</div>
              <div className="text-gray-600 mt-0.5">Academic Session: {settings.academicYear}</div>
            </div>

            <div className="text-right">
              <span className="text-gray-400 uppercase font-bold text-[10px] block mb-1">
                Course & Payment Mode
              </span>
              <div className="font-bold text-gray-900">{invoice.batchName}</div>
              <div className="text-gray-600 mt-0.5">
                Method: {invoice.paymentMethod || 'Online / Direct'}
              </div>
              <div className="text-gray-600 mt-0.5">
                Invoice Ref: <span className="font-mono">{invoice.invoiceNumber}</span>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">Billing Period</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-gray-900">
                    Tuition & Coaching Fees ({invoice.batchName})
                  </td>
                  <td className="py-3 px-3 text-center text-gray-500">
                    Current Term
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">
                    {formatCurrency(invoice.amount, settings.currencySymbol)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="border-t-2 border-gray-200 pt-3 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total Fee Amount:</span>
                <span className="font-bold">{formatCurrency(invoice.amount, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoice.paidAmount || 0, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold pt-1.5 border-t border-gray-100">
                <span>Remaining Due:</span>
                <span>
                  {formatCurrency(
                    Math.max(0, invoice.amount - (invoice.paidAmount || 0)),
                    settings.currencySymbol
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Signature and verification */}
          <div className="mt-10 pt-6 border-t border-dashed border-gray-300 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-gray-400">
                * This computer generated receipt does not require physical stamp when verified online.
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Support: {settings.email} | {settings.phone}
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-gray-400 pb-1 mb-1 font-serif italic text-gray-700">
                Apex Accounts
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
