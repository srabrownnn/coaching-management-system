'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types';
import { X, Printer, Sparkles, QrCode } from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { settings, batches } = useApp();

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentBatches = batches.filter((b) =>
    student.enrolledBatchIds.includes(b.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none">
        {/* Controls Bar - hidden when printing */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Official Student ID Card
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Badge
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-[330px] rounded-2xl bg-white border-2 border-indigo-200 shadow-xl overflow-hidden text-gray-800 font-sans print:shadow-none print:border-indigo-400">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-4 text-center text-white relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h3 className="font-extrabold text-sm tracking-wide uppercase">
                  {settings.instituteName}
                </h3>
              </div>
              <p className="text-[10px] text-indigo-100 font-medium">
                Official Student Identification Pass
              </p>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-white rounded-t-2xl" />
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6 pt-2 text-center flex flex-col items-center">
              {/* Photo Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-4 border-white -mt-6 mb-3">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>

              <h4 className="font-black text-lg text-gray-900 tracking-tight leading-snug">
                {student.name}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mt-1 border border-indigo-100">
                {student.gradeOrClass}
              </span>

              {/* Data Table */}
              <div className="w-full mt-4 bg-gray-50 rounded-xl p-3 text-left space-y-1.5 text-xs border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Student ID:</span>
                  <span className="font-mono font-bold text-gray-900">{student.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Academic Year:</span>
                  <span className="font-semibold text-gray-900">{settings.academicYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Guardian:</span>
                  <span className="font-semibold text-gray-900">{student.guardianName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Emergency:</span>
                  <span className="font-semibold text-gray-900">{student.guardianPhone || student.phone}</span>
                </div>
                <div className="pt-1 border-t border-gray-200">
                  <span className="text-gray-400 font-medium block mb-1">Batches:</span>
                  <div className="flex flex-wrap gap-1">
                    {studentBatches.map((b) => (
                      <span key={b.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-700 border">
                        {b.code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barcode / QR Simulation */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 w-full flex items-center justify-between px-2">
                <div className="text-left">
                  <span className="text-[9px] text-gray-400 block uppercase tracking-wider">
                    Authorized Signature
                  </span>
                  <div className="font-serif italic text-xs text-indigo-900 mt-1">
                    Director of Admissions
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 border">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
