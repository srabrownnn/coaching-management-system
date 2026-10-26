'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    searchTerm,
    setSearchTerm,
    isDarkMode,
    toggleDarkMode,
    notices,
    settings,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Analytics';
      case 'students':
        return 'Student Directory & Admissions';
      case 'batches':
        return 'Batches & Curriculum';
      case 'teachers':
        return 'Faculty & Instructors';
      case 'attendance':
        return 'Daily Attendance Register';
      case 'fees':
        return 'Fees, Invoices & Payments';
      case 'exams':
        return 'Examinations & Report Cards';
      case 'timetable':
        return 'Weekly Class Timetable';
      case 'notices':
        return 'Institute Notice Board';
      case 'settings':
        return 'Academy Configuration';
      default:
        return 'Dashboard';
    }
  };

  const urgentNotices = notices.filter((n) => n.priority === 'Urgent' || n.priority === 'High');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white capitalize">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {settings.instituteName}
          </p>
        </div>
      </div>

      {/* Right Controls: Search + Dark Mode + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-gray-100 transition-all placeholder-gray-400"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {urgentNotices.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    Announcements ({notices.length})
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('notices');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        setActiveTab('notices');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {notice.title}
                        </span>
                        {notice.priority === 'Urgent' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            AD
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
              Director Admin
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Super Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
