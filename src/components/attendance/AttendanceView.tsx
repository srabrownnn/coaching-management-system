'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AttendanceStatus } from '@/types';
import { Badge } from '@/components/common/Badge';
import {
  CalendarCheck2,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Check,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { batches, students, attendance, saveAttendance } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Local state for the current attendance sheet
  const [sheet, setSheet] = useState<
    { studentId: string; status: AttendanceStatus; note: string }[]
  >([]);

  // Find enrolled students for current batch
  const enrolledStudents = students.filter((s) =>
    s.enrolledBatchIds.includes(selectedBatchId)
  );

  // Load existing records or populate default
  useEffect(() => {
    if (!selectedBatchId) return;

    const existingRecord = attendance.find(
      (a) => a.batchId === selectedBatchId && a.date === selectedDate
    );

    if (existingRecord) {
      const recordsMap = new Map(
        existingRecord.records.map((r) => [r.studentId, r])
      );
      setSheet(
        enrolledStudents.map((s) => {
          const rec = recordsMap.get(s.id);
          return {
            studentId: s.id,
            status: rec ? rec.status : 'Present',
            note: rec?.note || '',
          };
        })
      );
    } else {
      setSheet(
        enrolledStudents.map((s) => ({
          studentId: s.id,
          status: 'Present',
          note: '',
        }))
      );
    }
  }, [selectedBatchId, selectedDate, attendance, students]);

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const setStudentNote = (studentId: string, note: string) => {
    setSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, note } : item
      )
    );
  };

  const markAll = (status: AttendanceStatus) => {
    setSheet((prev) => prev.map((item) => ({ ...item, status })));
  };

  const handleSave = () => {
    saveAttendance(selectedBatchId, selectedDate, sheet);
  };

  const presentCount = sheet.filter(
    (s) => s.status === 'Present' || s.status === 'Late'
  ).length;
  const absentCount = sheet.filter((s) => s.status === 'Absent').length;
  const attendanceRate =
    sheet.length > 0 ? Math.round((presentCount / sheet.length) * 100) : 0;

  const currentBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Daily Attendance Register
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track and log daily student attendance for each batch
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={enrolledStudents.length === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save Attendance Sheet
        </button>
      </div>

      {/* Selector Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Select Batch */}
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Select Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div className="w-full sm:w-48">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Batch Quick Info */}
        {currentBatch && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div>
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                {currentBatch.teacherName || 'Assigned Instructor'}
              </span>
              <span className="text-indigo-700/80 dark:text-indigo-300">
                {currentBatch.startTime} - {currentBatch.endTime} &bull; Room {currentBatch.room}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats and Quick Bulk Mark */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Batch Roster</span>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {enrolledStudents.length} Students
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            {enrolledStudents.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium">Present / Total</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {presentCount} / {sheet.length} ({attendanceRate}%)
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Bulk Actions:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => markAll('Present')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => markAll('Absent')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs"
              >
                All Absent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {enrolledStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No students are currently enrolled in this batch. Enroll students from the Student
            Directory tab to mark attendance!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">Roll #</th>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold">Remark / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
                {enrolledStudents.map((student) => {
                  const currentStatus =
                    sheet.find((s) => s.studentId === student.id)?.status || 'Present';
                  const currentNote =
                    sheet.find((s) => s.studentId === student.id)?.note || '';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                        {student.rollNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-gray-400">{student.phone}</div>
                      </td>

                      {/* Status Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                          {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceStatus[]).map(
                            (st) => {
                              const isSelected = currentStatus === st;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setStudentStatus(student.id, st)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    isSelected
                                      ? st === 'Present'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : st === 'Absent'
                                        ? 'bg-rose-600 text-white shadow-sm'
                                        : st === 'Late'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </td>

                      {/* Remark */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Optional note (e.g. sick, traffic)..."
                          value={currentNote}
                          onChange={(e) => setStudentNote(student.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
