'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CalendarDays, Clock, MapPin, User, Filter } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const TimetableView: React.FC = () => {
  const { batches, teachers } = useApp();
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');

  const filteredBatches = batches.filter((b) => {
    const matchBatch = filterBatch === 'all' || b.id === filterBatch;
    const matchTeacher = filterTeacher === 'all' || b.teacherId === filterTeacher;
    return matchBatch && matchTeacher;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Weekly Class Timetable
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Comprehensive schedule of daily coaching sessions, batches and lecture halls
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="py-2 px-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="py-2 px-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Faculty</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const dayBatches = filteredBatches.filter((b) => b.scheduleDays.includes(day));

          return (
            <div
              key={day}
              className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col h-full"
            >
              {/* Day Header */}
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                  {day === 'Mon' && 'Monday'}
                  {day === 'Tue' && 'Tuesday'}
                  {day === 'Wed' && 'Wednesday'}
                  {day === 'Thu' && 'Thursday'}
                  {day === 'Fri' && 'Friday'}
                  {day === 'Sat' && 'Saturday'}
                  {day === 'Sun' && 'Sunday'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                  {dayBatches.length} {dayBatches.length === 1 ? 'Class' : 'Classes'}
                </span>
              </div>

              {/* Sessions */}
              <div className="mt-3 space-y-3 flex-1">
                {dayBatches.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400 italic">
                    No classes scheduled
                  </div>
                ) : (
                  dayBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {batch.code}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {batch.startTime} - {batch.endTime}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                        {batch.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {batch.subject}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-gray-200/60 dark:border-gray-600/40 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {batch.teacherName || 'Assigned Instructor'}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />
                          {batch.room}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
