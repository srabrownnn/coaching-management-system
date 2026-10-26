'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/utils';
import { Badge } from '@/components/common/Badge';
import {
  Users,
  Layers,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CalendarCheck2,
  Clock,
  ArrowUpRight,
  UserPlus,
  CreditCard,
  CheckCircle,
  Bell,
  GraduationCap,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenEnrollModal: () => void;
  onOpenFeePaymentModal: (invoiceId?: string) => void;
  onSelectReceipt: (invoiceId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenEnrollModal,
  onOpenFeePaymentModal,
  onSelectReceipt,
}) => {
  const { students, batches, teachers, invoices, attendance, notices, settings, setActiveTab } =
    useApp();

  // Metrics calculation
  const totalStudents = students.length;
  const activeBatches = batches.filter((b) => b.status === 'Active').length;

  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalPending = invoices.reduce((sum, inv) => {
    const balance = inv.amount - (inv.paidAmount || 0);
    return sum + (balance > 0 ? balance : 0);
  }, 0);

  // Overall attendance calculation
  let totalPresent = 0;
  let totalMarked = 0;
  attendance.forEach((rec) => {
    rec.records.forEach((r) => {
      totalMarked++;
      if (r.status === 'Present' || r.status === 'Late') {
        totalPresent++;
      }
    });
  });
  const attendanceRate = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 92;

  // Today's classes
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  const todayDay = daysOfWeek[new Date().getDay()];
  const todaysBatches = batches.filter((b) => b.scheduleDays.includes(todayDay as any));

  // Recent invoices
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 md:p-8 shadow-lg shadow-indigo-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {settings.academicYear} Academic Session Active
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back to {settings.instituteName}
            </h2>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              {settings.tagline || 'Manage your coaching academy operations, students, batches, fees, and attendance seamlessly.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenEnrollModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Enroll Student
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all active:scale-95"
            >
              <CalendarCheck2 className="w-4 h-4" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl" />
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Enrolled</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14% this term
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Across all running courses</p>
        </div>

        {/* Fees Collected */}
        <div
          onClick={() => setActiveTab('fees')}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fees Collected</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalCollected, settings.currencySymbol)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Received</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Direct tuition payments</p>
        </div>

        {/* Pending Dues */}
        <div
          onClick={() => setActiveTab('fees')}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending Dues</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalPending, settings.currencySymbol)}
            </span>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Uncollected</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pending & overdue invoices</p>
        </div>

        {/* Avg Attendance Rate */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Attendance Rate</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Healthy</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Batch session consistency</p>
        </div>
      </div>

      {/* Middle Row: Today's Schedule & Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Today&apos;s Class Schedule ({todayDay})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active batches with scheduled coaching sessions today
              </p>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Full Timetable &rarr;
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysBatches.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No classes scheduled for today ({todayDay}). Check the weekly timetable for other days!
              </div>
            ) : (
              todaysBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs">
                      {batch.code}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {batch.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {batch.subject} &bull; Instructor: {batch.teacherName || 'Faculty Assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {batch.startTime} - {batch.endTime}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{batch.room}</div>
                    </div>

                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-medium transition-colors"
                    >
                      Attendance
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Institute Summary */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Academy Highlights
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Current operational capacities
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  <span>Fee Collection Progress</span>
                  <span>
                    {Math.round((totalCollected / (totalCollected + totalPending || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (totalCollected / (totalCollected + totalPending || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total Teachers / Faculty:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{teachers.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total Active Batches:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{activeBatches}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Total Active Invoices:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{invoices.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              Manage Institute Profile & Export &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Invoices & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Recent Fee Invoices & Receipts
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest student billing and fee collection records
              </p>
            </div>
            <button
              onClick={() => setActiveTab('fees')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Invoices &rarr;
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="pb-3 font-semibold">Invoice #</th>
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Batch</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30">
                    <td className="py-3 font-mono font-medium text-gray-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {inv.studentName}
                      </div>
                      <div className="text-[11px] text-gray-400">{inv.studentRoll}</div>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{inv.batchName}</td>
                    <td className="py-3 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(inv.amount, settings.currencySymbol)}
                    </td>
                    <td className="py-3">
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
                    <td className="py-3 text-right">
                      {inv.status === 'Paid' ? (
                        <button
                          onClick={() => onSelectReceipt(inv.id)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenFeePaymentModal(inv.id)}
                          className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 font-medium"
                        >
                          Collect
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notices preview */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Latest Notices
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Notice Board &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {notice.title}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        notice.priority === 'Urgent'
                          ? 'danger'
                          : notice.priority === 'High'
                          ? 'warning'
                          : 'gray'
                      }
                    >
                      {notice.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {notice.content}
                  </p>
                  <div className="mt-2 text-[10px] text-gray-400">{formatDate(notice.date)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
