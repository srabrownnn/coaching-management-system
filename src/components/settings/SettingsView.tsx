'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { InstituteSettings } from '@/types';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  Building,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportDataJSON,
    importDataJSON,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState<InstituteSettings>({ ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const handleChange = (field: keyof InstituteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleExport = () => {
    const jsonString = exportDataJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coaching_academy_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded successfully!');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText);
    if (ok) {
      setImportJsonText('');
      setShowImportArea(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Institute Settings & Configuration
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Customize institute profile, currency, academic terms, and perform data backups
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <Building className="w-4 h-4 text-indigo-600" />
            Academy Profile Information
          </h3>
          <p className="text-xs text-gray-500">
            This information appears on student ID cards, fee vouchers, and exam transcripts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Institute / Coaching Name *
              </label>
              <input
                type="text"
                required
                value={formData.instituteName}
                onChange={(e) => handleChange('instituteName', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Motto / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Official Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial formats */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Billing & Regional Preferences
          </h3>
          <p className="text-xs text-gray-500">
            Configure currency symbol, academic cycle, and invoice numbering
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-bold focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Academic Year / Term
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Receipt Prefix
              </label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={(e) => handleChange('receiptPrefix', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-mono focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>

      {/* Backup and Data Maintenance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Data Portability & Backup
          </h3>
          <p className="text-xs text-gray-500">
            Export all records (students, batches, fees, exams, attendance) as a single JSON file or restore from a previous backup
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data to JSON
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            Restore from JSON
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to restore original default demo data? All custom additions will be reset.'
                )
              ) {
                resetAllData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Demo Data
          </button>
        </div>

        {showImportArea && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-3 mt-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Paste Backup JSON Payload
            </label>
            <textarea
              rows={4}
              placeholder='Paste {"settings": {...}, "students": [...], ...}'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportArea(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
              >
                Apply Backup Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
