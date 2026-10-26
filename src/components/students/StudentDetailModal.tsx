'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDate, calculateGrade } from '@/utils';
import {
  X,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Layers,
  CreditCard,
  FileSpreadsheet,
  IdCard,
} from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onOpenIdCard: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onOpenIdCard,
}) => {
  const { batches, invoices, exams, attendance, settings } = useApp();

  if (!isOpen || !student) return null;

  // Enrolled Batches
  const enrolledBatches = batches.filter((b) =>
    student.enrolledBatchIds.includes(b.id)
  );

  // Invoices for student
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);

  // Exams for student
  const studentExams = exams
    .map((exam) => {
      const result = exam.results.find((r) => r.studentId === student.id);
      return {
        ...exam,
        userResult: result,
      };
    })
    .filter((e) => e.userResult !== undefined);

  // Attendance for student
  let presentCount = 0;
  let totalSessions = 0;
  attendance.forEach((att) => {
    const record = att.records.find((r) => r.studentId === student.id);
    if (record) {
      totalSessions++;
      if (record.status === 'Present' || record.status === 'Late') {
        presentCount++;
      }
    }
  });

  const attendancePercent =
    totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Profile */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-lg">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold">{student.name}</h3>
                  <Badge variant={student.status === 'Active' ? 'success' : 'warning'}>
                    {student.status}
                  </Badge>
                </div>
                <p className="text-indigo-200 text-xs font-mono mt-0.5">
                  Roll: {student.rollNumber} &bull; {student.gradeOrClass}
                </p>
                <p className="text-indigo-300 text-xs mt-1">
                  Admitted on {formatDate(student.admissionDate)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenIdCard(student);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all active:scale-95 self-stretch sm:self-auto justify-center"
            >
              <IdCard className="w-4 h-4" />
              Print ID Card
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Attendance</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {attendancePercent}%
              </div>
              <span className="text-[10px] text-gray-400">{presentCount} of {totalSessions} classes</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Batches Enrolled</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {enrolledBatches.length}
              </div>
              <span className="text-[10px] text-gray-400">Active subjects</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Fee Invoices</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {studentInvoices.length}
              </div>
              <span className="text-[10px] text-gray-400">Billing records</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Exams Taken</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {studentExams.length}
              </div>
              <span className="text-[10px] text-gray-400">Academic tests</span>
            </div>
          </div>

          {/* Contact & Guardian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Student Contact
              </h4>
              <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{student.email || 'No email registered'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{student.phone || 'No phone registered'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Guardian Information
              </h4>
              <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Name: {student.guardianName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>Emergency: {student.guardianPhone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Batches Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Enrolled Batches
            </h4>
            <div className="space-y-2">
              {enrolledBatches.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No active batches assigned.</p>
              ) : (
                enrolledBatches.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{b.name}</span>
                      <span className="text-gray-400 ml-2">({b.code})</span>
                      <p className="text-[11px] text-gray-500">Instructor: {b.teacherName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(b.monthlyFee, settings.currencySymbol)} / mo
                      </span>
                      <p className="text-[11px] text-gray-400">
                        {b.scheduleDays.join(', ')} &bull; {b.startTime}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Exam Results */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> Exam Grades
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500">
                  <tr>
                    <th className="p-2.5 font-semibold">Exam Title</th>
                    <th className="p-2.5 font-semibold">Subject</th>
                    <th className="p-2.5 font-semibold">Score</th>
                    <th className="p-2.5 font-semibold">Grade</th>
                    <th className="p-2.5 font-semibold">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {studentExams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                        No exam records found for this student.
                      </td>
                    </tr>
                  ) : (
                    studentExams.map((e) => {
                      const grade = calculateGrade(
                        e.userResult?.marksObtained || 0,
                        e.totalMarks
                      );
                      return (
                        <tr key={e.id}>
                          <td className="p-2.5 font-medium text-gray-900 dark:text-white">
                            {e.title}
                          </td>
                          <td className="p-2.5 text-gray-500">{e.subject}</td>
                          <td className="p-2.5 font-bold">
                            {e.userResult?.marksObtained} / {e.totalMarks}
                          </td>
                          <td className="p-2.5">
                            <Badge variant={grade.pass ? 'success' : 'danger'}>
                              {grade.grade} ({grade.percentage}%)
                            </Badge>
                          </td>
                          <td className="p-2.5 text-gray-500 italic">
                            {e.userResult?.feedback || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoices */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" /> Tuition Invoices
            </h4>
            <div className="space-y-2">
              {studentInvoices.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No invoices issued.</p>
              ) : (
                studentInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-gray-400 ml-2">Due: {formatDate(inv.dueDate)}</span>
                      <p className="text-[11px] text-gray-500">{inv.batchName}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(inv.amount, settings.currencySymbol)}
                      </div>
                      <Badge
                        size="sm"
                        variant={
                          inv.status === 'Paid'
                            ? 'success'
                            : inv.status === 'Overdue'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
