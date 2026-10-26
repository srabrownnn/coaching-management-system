'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Teacher } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/utils';
import {
  GraduationCap,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Edit2,
  Trash2,
  Layers,
  Search,
} from 'lucide-react';

interface TeacherListViewProps {
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
}

export const TeacherListView: React.FC<TeacherListViewProps> = ({
  onAddTeacher,
  onEditTeacher,
}) => {
  const { teachers, batches, deleteTeacher, settings } = useApp();
  const [search, setSearch] = useState('');

  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.qualification.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Faculty & Instructors
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total {teachers.length} active coaches and department heads
          </p>
        </div>

        <button
          onClick={onAddTeacher}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers by name, qualification, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => {
          const assignedBatches = batches.filter((b) => b.teacherId === teacher.id);

          return (
            <div
              key={teacher.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                      {teacher.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {teacher.subject}
                      </p>
                    </div>
                  </div>

                  <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'}>
                    {teacher.status}
                  </Badge>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                    <span>{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                {/* Assigned Batches */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Assigned Batches ({assignedBatches.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {assignedBatches.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No active batches</span>
                    ) : (
                      assignedBatches.map((b) => (
                        <span
                          key={b.id}
                          className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                        >
                          {b.code} - {b.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block">
                    Remuneration
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(teacher.salary, settings.currencySymbol)}
                    <span className="text-[10px] text-gray-400 font-normal"> / mo</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditTeacher(teacher)}
                    className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    title="Edit Teacher"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove teacher ${teacher.name}?`)) {
                        deleteTeacher(teacher.id);
                      }
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-700"
                    title="Delete Teacher"
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
