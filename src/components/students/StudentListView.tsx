'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types';
import { Badge } from '@/components/common/Badge';
import {
  Search,
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  IdCard,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';

interface StudentListViewProps {
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onViewIdCard: (student: Student) => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  onAddStudent,
  onEditStudent,
  onViewStudent,
  onViewIdCard,
}) => {
  const { students, batches, deleteStudent, searchTerm } = useApp();
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');

  const effectiveSearch = (searchTerm || localSearch).toLowerCase().trim();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(effectiveSearch) ||
      s.rollNumber.toLowerCase().includes(effectiveSearch) ||
      s.email.toLowerCase().includes(effectiveSearch) ||
      s.phone.includes(effectiveSearch) ||
      s.gradeOrClass.toLowerCase().includes(effectiveSearch);

    const matchesBatch =
      filterBatch === 'all' || s.enrolledBatchIds.includes(filterBatch);

    const matchesStatus =
      filterStatus === 'all' || s.status === filterStatus;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Student Directory
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total {students.length} students enrolled &bull; {filteredStudents.length} displayed
          </p>
        </div>

        <button
          onClick={onAddStudent}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Enroll New Student
        </button>
      </div>

      {/* Filters and search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, phone or class..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Roll # / Grade</th>
                <th className="py-3 px-4 font-semibold">Contact & Guardian</th>
                <th className="py-3 px-4 font-semibold">Enrolled Batches</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No students match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentBatches = batches.filter((b) =>
                    student.enrolledBatchIds.includes(b.id)
                  );

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </div>
                          <div>
                            <button
                              onClick={() => onViewStudent(student)}
                              className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors"
                            >
                              {student.name}
                            </button>
                            <div className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll & Grade */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-medium text-gray-900 dark:text-white">
                          {student.rollNumber}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-indigo-500" />
                          {student.gradeOrClass}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-gray-900 dark:text-white flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {student.phone}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Guardian: {student.guardianName} ({student.guardianPhone})
                        </div>
                      </td>

                      {/* Batches */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {studentBatches.length === 0 ? (
                            <span className="text-gray-400 italic">None</span>
                          ) : (
                            studentBatches.map((b) => (
                              <span
                                key={b.id}
                                className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium text-[10px]"
                              >
                                {b.code}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            student.status === 'Active'
                              ? 'success'
                              : student.status === 'On Leave'
                              ? 'warning'
                              : 'gray'
                          }
                        >
                          {student.status}
                        </Badge>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onViewStudent(student)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewIdCard(student)}
                            title="Generate Student ID Card"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-700"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditStudent(student)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(`Are you sure you want to delete ${student.name}?`)
                              ) {
                                deleteStudent(student.id);
                              }
                            }}
                            title="Delete Student"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-700"
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
