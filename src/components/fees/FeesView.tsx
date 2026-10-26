'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FeeInvoice } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/utils';
import {
  CreditCard,
  Plus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Trash2,
  Printer,
} from 'lucide-react';

interface FeesViewProps {
  onOpenCreateInvoice: () => void;
  onOpenPaymentModal: (invoiceId: string) => void;
  onOpenReceiptModal: (invoiceId: string) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  onOpenCreateInvoice,
  onOpenPaymentModal,
  onOpenReceiptModal,
}) => {
  const { invoices, deleteInvoice, settings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalPending = invoices.reduce((sum, inv) => {
    const diff = inv.amount - (inv.paidAmount || 0);
    return sum + (diff > 0 ? diff : 0);
  }, 0);
  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentRoll.toLowerCase().includes(search.toLowerCase()) ||
      inv.batchName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Fees & Billing Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Generate student tuition invoices, collect payments, and print official receipts
          </p>
        </div>

        <button
          onClick={onOpenCreateInvoice}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400">Total Collected</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalCollected, settings.currencySymbol)}
            </div>
            <span className="text-[11px] text-gray-400">Paid invoices & partial deposits</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400">Outstanding Receivables</span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(totalPending, settings.currencySymbol)}
            </div>
            <span className="text-[11px] text-gray-400">Pending & overdue fee balance</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400">Overdue Invoices</span>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {overdueCount} Accounts
            </div>
            <span className="text-[11px] text-gray-400">Past due date deadlines</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice #, student name, roll # or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 text-xs font-medium rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice #</th>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Batch / Course</th>
                <th className="py-3 px-4 font-semibold">Amount & Paid</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No invoices match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const balance = inv.amount - (inv.paidAmount || 0);

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-white">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {inv.studentName}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {inv.studentRoll}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300 font-medium">
                        {inv.batchName}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(inv.amount, settings.currencySymbol)}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Paid: {formatCurrency(inv.paidAmount || 0, settings.currencySymbol)}
                          {balance > 0 && (
                            <span className="text-rose-500 font-semibold ml-1">
                              (Rem: {formatCurrency(balance, settings.currencySymbol)})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                        {formatDate(inv.dueDate)}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            inv.status === 'Paid'
                              ? 'success'
                              : inv.status === 'Overdue'
                              ? 'danger'
                              : inv.status === 'Partial'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => onOpenPaymentModal(inv.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
                            >
                              Collect
                            </button>
                          )}

                          <button
                            onClick={() => onOpenReceiptModal(inv.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                            title="Print / View Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                                deleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
