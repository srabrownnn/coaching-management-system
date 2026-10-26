'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Exam, ExamResult } from '@/types';
import { calculateGrade } from '@/utils';
import { Badge } from '@/components/common/Badge';
import { X, Save } from 'lucide-react';

interface ExamGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
}

export const ExamGradingModal: React.FC<ExamGradingModalProps> = ({
  isOpen,
  onClose,
  exam,
}) => {
  const { students, saveExamResults } = useApp();

  const [scores, setScores] = useState<
    { studentId: string; marksObtained: number; feedback: string }[]
  >([]);

  const enrolledStudents = exam
    ? students.filter((s) => s.enrolledBatchIds.includes(exam.batchId))
    : [];

  useEffect(() => {
    if (exam) {
      const resultsMap = new Map(exam.results.map((r) => [r.studentId, r]));
      setScores(
        enrolledStudents.map((s) => {
          const res = resultsMap.get(s.id);
          return {
            studentId: s.id,
            marksObtained: res ? res.marksObtained : 0,
            feedback: res?.feedback || '',
          };
        })
      );
    }
  }, [exam, isOpen]);

  if (!isOpen || !exam) return null;

  const updateStudentMark = (studentId: string, marksObtained: number) => {
    setScores((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, marksObtained } : s))
    );
  };

  const updateStudentFeedback = (studentId: string, feedback: string) => {
    setScores((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, feedback } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveExamResults(exam.id, scores);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Grade Examination: {exam.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Marks: {exam.totalMarks} &bull; Passing Score: {exam.passingMarks}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
            {enrolledStudents.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No students enrolled in this batch yet.
              </div>
            ) : (
              enrolledStudents.map((student) => {
                const currentScore =
                  scores.find((s) => s.studentId === student.id)?.marksObtained || 0;
                const currentFeedback =
                  scores.find((s) => s.studentId === student.id)?.feedback || '';
                const grade = calculateGrade(currentScore, exam.totalMarks);

                return (
                  <div
                    key={student.id}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-[180px]">
                      <div className="font-bold text-xs text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {student.rollNumber}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-24">
                        <input
                          type="number"
                          min={0}
                          max={exam.totalMarks}
                          value={currentScore}
                          onChange={(e) =>
                            updateStudentMark(student.id, Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-bold text-center"
                        />
                      </div>

                      <div className="w-20 text-center">
                        <Badge variant={grade.pass ? 'success' : 'danger'}>
                          {grade.grade} ({grade.percentage}%)
                        </Badge>
                      </div>

                      <input
                        type="text"
                        placeholder="Teacher remark..."
                        value={currentFeedback}
                        onChange={(e) => updateStudentFeedback(student.id, e.target.value)}
                        className="flex-1 min-w-[120px] px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              Save Grades
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
