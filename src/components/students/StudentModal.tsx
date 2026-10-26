'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, StudentStatus } from '@/types';
import { X, Check } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { addStudent, updateStudent, batches, students } = useApp();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [gradeOrClass, setGradeOrClass] = useState('Grade 11');
  const [enrolledBatchIds, setEnrolledBatchIds] = useState<string[]>([]);
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<StudentStatus>('Active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setRollNumber(studentToEdit.rollNumber);
      setEmail(studentToEdit.email);
      setPhone(studentToEdit.phone);
      setGuardianName(studentToEdit.guardianName);
      setGuardianPhone(studentToEdit.guardianPhone);
      setGradeOrClass(studentToEdit.gradeOrClass);
      setEnrolledBatchIds(studentToEdit.enrolledBatchIds || []);
      setAdmissionDate(studentToEdit.admissionDate);
      setStatus(studentToEdit.status);
      setNotes(studentToEdit.notes || '');
    } else {
      setName('');
      const nextNum = String(students.length + 1).padStart(3, '0');
      setRollNumber(`APX-2025-${nextNum}`);
      setEmail('');
      setPhone('');
      setGuardianName('');
      setGuardianPhone('');
      setGradeOrClass('Grade 11');
      setEnrolledBatchIds([]);
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
      setNotes('');
    }
  }, [studentToEdit, isOpen, students.length]);

  if (!isOpen) return null;

  const toggleBatch = (batchId: string) => {
    setEnrolledBatchIds((prev) =>
      prev.includes(batchId) ? prev.filter((id) => id !== batchId) : [...prev, batchId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNumber) return;

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        name,
        rollNumber,
        email,
        phone,
        guardianName,
        guardianPhone,
        gradeOrClass,
        enrolledBatchIds,
        admissionDate,
        status,
        notes,
      });
    } else {
      addStudent({
        name,
        rollNumber,
        email,
        phone,
        guardianName,
        guardianPhone,
        gradeOrClass,
        enrolledBatchIds,
        admissionDate,
        status,
        notes,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {studentToEdit ? 'Edit Student Details' : 'Enroll New Student'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provide complete academic and contact credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Anderson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Roll / Student ID *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                placeholder="Guardian Full Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Guardian Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 111-2222"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Class / Grade Level
              </label>
              <select
                value={gradeOrClass}
                onChange={(e) => setGradeOrClass(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="University / Pre-Med">University / Pre-Med</option>
                <option value="Competitive Test Prep">Competitive Test Prep</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Admission Date
              </label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Enrollment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>

          {/* Enrolled Batches */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Assign to Batches
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {batches.map((batch) => {
                const isSelected = enrolledBatchIds.includes(batch.id);
                return (
                  <div
                    key={batch.id}
                    onClick={() => toggleBatch(batch.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{batch.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {batch.code} &bull; {batch.startTime}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Internal Academic Notes / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Strengths, weaknesses, special accommodations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
            />
          </div>

          {/* Footer actions */}
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
              {studentToEdit ? 'Save Changes' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
