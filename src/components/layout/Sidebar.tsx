'use client';

import React from 'react';
import { useApp, NavigationTab } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  CalendarCheck2,
  CreditCard,
  FileSpreadsheet,
  CalendarDays,
  BellRing,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, students, batches, invoices, settings } = useApp();

  const pendingInvoicesCount = invoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Overdue'
  ).length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeVariant?: 'danger' | 'primary' | 'gray';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: students.length },
    { id: 'batches', label: 'Batches & Courses', icon: Layers, badge: batches.length },
    { id: 'teachers', label: 'Faculty / Teachers', icon: GraduationCap },
    { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck2 },
    {
      id: 'fees',
      label: 'Fees & Billing',
      icon: CreditCard,
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined,
      badgeVariant: 'danger',
    },
    { id: 'exams', label: 'Exams & Grades', icon: FileSpreadsheet },
    { id: 'timetable', label: 'Class Timetable', icon: CalendarDays },
    { id: 'notices', label: 'Notice Board', icon: BellRing },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-base leading-tight tracking-tight">
                {settings.instituteName.split(' ')[0]}
                <span className="text-indigo-600 dark:text-indigo-400">Coach</span>
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Academy Suite v2.0
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Main Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:bg-indigo-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'danger'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Academy Status / Footer Card */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800/60 dark:to-indigo-950/40 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Session Active
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {settings.academicYear} Academic Term
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
