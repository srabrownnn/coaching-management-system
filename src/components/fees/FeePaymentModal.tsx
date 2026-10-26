'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { FeeInvoice, PaymentMethod } from '@/types';
import { formatCurrency } from '@/utils';
import { X, DollarSign } from 'lucide-react';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceIdToPay?: string | null;
  mode: 'collect' | 'create';
}

export const FeePaymentModal: React.FC<FeePaymentModalProps> = ({
  isOpen,
  onClose,
  invoiceIdToPay,
  mode,
}) => {
  const { invoices, students, batches, recordPayment, addInvoice, settings } = useApp();

  const invoice = invoices.find((i) => i.id === invoiceIdToPay);

  // Collect payment states
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Online / UPI');
  const [payNotes, setPayNotes] = useState('');

  // Create invoice states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [invAmount, setInvAmount] = useState(250);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  useEffect(() => {
    if (invoice) {
      const balance = invoice.amount - (invoice.paidAmount || 0);
      setPayAmount(balance > 0 ? balance : invoice.amount);
      setPayMethod(invoice.paymentMethod || 'Online / UPI');
      setPayNotes('');
    } else {
      setPayAmount(0);
    }

    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
    if (batches.length > 0 && !selectedBatchId) {
      setSelectedBatchId(batches[0].id);
      setInvAmount(batches[0].monthlyFee);
    }
  }, [invoice, isOpen, students, batches, selectedStudentId, selectedBatchId]);

  if (!isOpen) return null;

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice || payAmount <= 0) return;
    recordPayment(invoice.id, Number(payAmount), payMethod, payNotes);
    onClose();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    const bt = batches.find((b) => b.id === selectedBatchId);
    if (!st || !bt) return;

    addInvoice({
      studentId: st.id,
      studentName: st.name,
      studentRoll: st.rollNumber,
      batchId: bt.id,
      batchName: bt.name,
      amount: Number(invAmount),
      paidAmount: 0,
      dueDate,
      status: 'Pending',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {mode === 'collect' ? 'Collect Fee Payment' : 'Create Student Invoice'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === 'collect'
                ? `Recording payment for ${invoice?.studentName || 'Invoice'}`
                : 'Issue new monthly tuition billing'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'collect' && invoice ? (
          <form onSubmit={handleCollectSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 text-xs space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Invoice:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Student:</span>
                <span className="font-bold text-gray-900 dark:text-white">{invoice.studentName}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Total Billed:</span>
                <span>{formatCurrency(invoice.amount, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between font-medium text-emerald-600">
                <span>Already Paid:</span>
                <span>{formatCurrency(invoice.paidAmount || 0, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600 pt-1 border-t border-gray-200 dark:border-gray-600">
                <span>Remaining Due:</span>
                <span>
                  {formatCurrency(
                    invoice.amount - (invoice.paidAmount || 0),
                    settings.currencySymbol
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Payment Amount to Collect *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  {settings.currencySymbol}
                </span>
                <input
                  type="number"
                  min={1}
                  max={invoice.amount - (invoice.paidAmount || 0)}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="Online / UPI">Online / UPI</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash at Counter</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Transaction Ref / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Transaction ID, receipt remarks"
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Confirm Payment Receipt
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Student *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Batch / Course *
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                  const b = batches.find((x) => x.id === e.target.value);
                  if (b) setInvAmount(b.monthlyFee);
                }}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({formatCurrency(b.monthlyFee, settings.currencySymbol)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Invoice Total Amount *
              </label>
              <input
                type="number"
                min={1}
                value={invAmount}
                onChange={(e) => setInvAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
              >
                Generate Invoice
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
