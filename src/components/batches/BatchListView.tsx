'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Batch } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils';
import {
  Layers,
  Plus,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Search,
  BookOpen,
} from 'lucide-react';

interface BatchListViewProps {
  onAddBatch: () => void;
  onEditBatch: (batch: Batch) => void;
}

export const BatchListView: React.FC<BatchListViewProps> = ({
  onAddBatch,
  onEditBatch,
}) => {
  const { batches, students, deleteBatch, settings } = useApp();
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [search, setSearch] = useState('');

  const subjects = Array.from(new Set(batches.map((b) => b.subject)));

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase()) ||
      (b.teacherName || '').toLowerCase().includes(search.toLowerCase());

    const matchesSubject = filterSubject === 'all' || b.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Batches & Courses
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage academic batches, schedules, subject instructors, and student capacities
          </p>
        </div>

        <button
          onClick={onAddBatch}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Batch
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search batches by title, code, instructor or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.map((batch) => {
          const enrolledStudents = students.filter((s) =>
            s.enrolledBatchIds.includes(batch.id)
          );
          const capacityPercent = Math.min(
            100,
            Math.round((enrolledStudents.length / (batch.capacity || 1)) * 100)
          );

          return (
            <div
              key={batch.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                    {batch.code}
                  </span>
                  <Badge
                    variant={
                      batch.status === 'Active'
                        ? 'success'
                        : batch.status === 'Upcoming'
                        ? 'primary'
                        : 'gray'
                    }
                  >
                    {batch.status}
                  </Badge>
                </div>

                {/* Batch Name */}
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {batch.name}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {batch.subject}
                </p>

                {batch.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {batch.description}
                  </p>
                )}

                {/* Info List */}
                <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {batch.scheduleDays.join(', ')} &bull; {batch.startTime} - {batch.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Room: {batch.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>Faculty: </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {batch.teacherName || 'Not assigned'}
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500 font-medium">Batch Enrollment</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {enrolledStudents.length} / {batch.capacity} seats
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPercent >= 90
                          ? 'bg-rose-500'
                          : capacityPercent >= 70
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                    Tuition Fee
                  </span>
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {formatCurrency(batch.monthlyFee, settings.currencySymbol)}
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditBatch(batch)}
                    className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                    title="Edit Batch"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete batch "${batch.name}"?`)) {
                        deleteBatch(batch.id);
                      }
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
