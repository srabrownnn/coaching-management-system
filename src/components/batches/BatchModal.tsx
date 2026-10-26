'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Batch } from '@/types';
import { X } from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchToEdit?: Batch | null;
}

const ALL_DAYS: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  batchToEdit,
}) => {
  const { addBatch, updateBatch, teachers, batches } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [scheduleDays, setScheduleDays] = useState<Batch['scheduleDays']>(['Mon', 'Wed', 'Fri']);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [room, setRoom] = useState('Room 101');
  const [capacity, setCapacity] = useState(25);
  const [monthlyFee, setMonthlyFee] = useState(200);
  const [status, setStatus] = useState<Batch['status']>('Active');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (batchToEdit) {
      setName(batchToEdit.name);
      setCode(batchToEdit.code);
      setSubject(batchToEdit.subject);
      setTeacherId(batchToEdit.teacherId);
      setScheduleDays(batchToEdit.scheduleDays);
      setStartTime(batchToEdit.startTime);
      setEndTime(batchToEdit.endTime);
      setRoom(batchToEdit.room);
      setCapacity(batchToEdit.capacity);
      setMonthlyFee(batchToEdit.monthlyFee);
      setStatus(batchToEdit.status);
      setDescription(batchToEdit.description || '');
    } else {
      setName('');
      const count = batches.length + 1;
      setCode(`BAT-${count * 100}`);
      setSubject('Mathematics');
      setTeacherId(teachers[0]?.id || '');
      setScheduleDays(['Mon', 'Wed', 'Fri']);
      setStartTime('10:00 AM');
      setEndTime('11:30 AM');
      setRoom('Room 201');
      setCapacity(25);
      setMonthlyFee(220);
      setStatus('Active');
      setDescription('');
    }
  }, [batchToEdit, isOpen, teachers, batches.length]);

  if (!isOpen) return null;

  const toggleDay = (day: (typeof ALL_DAYS)[number]) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const selectedTeacher = teachers.find((t) => t.id === teacherId);

    const payload = {
      name,
      code,
      subject,
      teacherId,
      teacherName: selectedTeacher?.name || 'Assigned Instructor',
      scheduleDays,
      startTime,
      endTime,
      room,
      capacity: Number(capacity),
      monthlyFee: Number(monthlyFee),
      status,
      description,
    };

    if (batchToEdit) {
      updateBatch(batchToEdit.id, payload);
    } else {
      addBatch(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {batchToEdit ? 'Edit Batch' : 'Create New Batch'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure course schedule, limits, and faculty
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Batch Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Physics Olympiad Sprint"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Batch Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 font-mono focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Pure Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Assigned Instructor / Coach
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Weekly Class Days
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = scheduleDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="11:30 AM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Classroom / Room
              </label>
              <input
                type="text"
                placeholder="Room 101 / Hall A"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Capacity (Max Students)
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Monthly Tuition Fee
              </label>
              <input
                type="number"
                min={0}
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Batch Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Batch['status'])}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description / Course Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Outline prerequisites, targets, or syllabus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
            />
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
              {batchToEdit ? 'Save Changes' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
