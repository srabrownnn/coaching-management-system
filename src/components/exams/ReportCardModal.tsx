'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Exam } from '@/types';
import { calculateGrade, formatDate } from '@/utils';
import { Badge } from '@/components/common/Badge';
import { X, Printer, Sparkles, Award } from 'lucide-react';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  exam,
}) => {
  const { students, settings } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  if (!isOpen || !exam) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentStudentId = selectedStudentId || exam.results[0]?.studentId;
  const currentStudent = students.find((s) => s.id === currentStudentId);
  const studentResult = exam.results.find((r) => r.studentId === currentStudentId);

  const gradeInfo = studentResult
    ? calculateGrade(studentResult.marksObtained, exam.totalMarks)
    : { grade: 'N/A', percentage: 0, pass: false };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none my-8">
        {/* Controls Bar - hidden on print */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Student:
            </span>
            <select
              value={currentStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="py-1 px-2 text-xs rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {exam.results.map((r) => {
                const s = students.find((st) => st.id === r.studentId);
                return (
                  <option key={r.studentId} value={r.studentId}>
                    {s?.name || r.studentId}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report Card
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card */}
        <div className="p-8 bg-white text-gray-900 font-sans print:p-6">
          {/* Header */}
          <div className="text-center border-b-2 border-indigo-600 pb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                {settings.instituteName}
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Academic Progress & Evaluation Transcript
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {settings.address} &bull; {settings.email}
            </p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 py-5 border-b border-gray-100 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-gray-400">Student Name: </span>
                <span className="font-bold text-gray-900">{currentStudent?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400">Roll Number: </span>
                <span className="font-mono font-bold text-gray-900">{currentStudent?.rollNumber}</span>
              </div>
              <div>
                <span className="text-gray-400">Class / Grade: </span>
                <span className="font-medium text-gray-900">{currentStudent?.gradeOrClass}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-gray-400">Assessment: </span>
                <span className="font-bold text-gray-900">{exam.title}</span>
              </div>
              <div>
                <span className="text-gray-400">Subject: </span>
                <span className="font-medium text-gray-900">{exam.subject}</span>
              </div>
              <div>
                <span className="text-gray-400">Exam Date: </span>
                <span className="font-medium text-gray-900">{formatDate(exam.date)}</span>
              </div>
            </div>
          </div>

          {/* Grade Overview Pill */}
          <div className="my-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-indigo-900 block">
                  Overall Performance
                </span>
                <span className="text-xs text-indigo-700">
                  Status: {gradeInfo.pass ? 'PASSED & QUALIFIED' : 'NEEDS IMPROVEMENT'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-indigo-700">{gradeInfo.grade}</span>
              <span className="text-xs text-gray-500 block font-semibold">
                {gradeInfo.percentage}%
              </span>
            </div>
          </div>

          {/* Marks Breakdown Table */}
          <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden mb-6">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Subject / Module</th>
                <th className="py-2.5 px-3 text-center">Total Marks</th>
                <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                <th className="py-2.5 px-3 text-center">Percentage</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-3 font-semibold">{exam.subject}</td>
                <td className="py-3 px-3 text-center">{exam.totalMarks}</td>
                <td className="py-3 px-3 text-center font-bold text-gray-900">
                  {studentResult?.marksObtained || 0}
                </td>
                <td className="py-3 px-3 text-center font-semibold">
                  {gradeInfo.percentage}%
                </td>
                <td className="py-3 px-3 text-center font-black text-indigo-600">
                  {gradeInfo.grade}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Instructor Remarks */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs mb-8">
            <span className="font-bold text-gray-700 block mb-1">Teacher Remarks:</span>
            <p className="text-gray-600 italic">
              {studentResult?.feedback || 'Good overall understanding of fundamental core principles.'}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end text-xs">
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 pb-1 mb-1 font-serif italic text-gray-700">
                Subject Teacher
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Instructor</span>
            </div>

            <div className="text-center">
              <div className="w-36 border-b border-gray-400 pb-1 mb-1 font-serif italic text-gray-700">
                Principal / Dean
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Academic Dean</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
