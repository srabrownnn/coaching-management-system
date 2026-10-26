'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Exam } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/utils';
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Printer,
  Search,
} from 'lucide-react';

interface ExamsViewProps {
  onScheduleExam: () => void;
  onGradeExam: (exam: Exam) => void;
  onOpenReportCard: (exam: Exam) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  onScheduleExam,
  onGradeExam,
  onOpenReportCard,
}) => {
  const { exams, deleteExam } = useApp();
  const [search, setSearch] = useState('');

  const filteredExams = exams.filter((e) => {
    return (
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.batchName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Examinations & Assessments
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Schedule tests, input student grades, and print official report cards
          </p>
        </div>

        <button
          onClick={onScheduleExam}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Schedule New Exam
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams by test title, batch or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => {
          const gradedStudentsCount = exam.results.length;

          // Highest & Average marks
          let highest = 0;
          let sum = 0;
          if (exam.results.length > 0) {
            exam.results.forEach((r) => {
              if (r.marksObtained > highest) highest = r.marksObtained;
              sum += r.marksObtained;
            });
          }
          const average =
            exam.results.length > 0 ? Math.round(sum / exam.results.length) : 0;

          return (
            <div
              key={exam.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={exam.status === 'Graded' ? 'success' : 'primary'}>
                    {exam.status}
                  </Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(exam.date)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {exam.title}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {exam.subject} &bull; {exam.batchName}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Marks:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {exam.totalMarks} pts (Passing: {exam.passingMarks})
                    </span>
                  </div>

                  {exam.status === 'Graded' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Graded Candidates:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {gradedStudentsCount} Students
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Class Average / Top:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {average} pts / {highest} pts
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-amber-600 font-medium italic pt-1">
                      Scores not yet entered
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => onGradeExam(exam)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors"
                >
                  {exam.status === 'Graded' ? 'Edit Marks' : 'Enter Marks'}
                </button>

                <div className="flex items-center gap-1.5">
                  {exam.status === 'Graded' && (
                    <button
                      onClick={() => onOpenReportCard(exam)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-700"
                      title="Print Report Cards"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Delete exam "${exam.title}"?`)) {
                        deleteExam(exam.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-gray-700"
                    title="Delete Exam"
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
