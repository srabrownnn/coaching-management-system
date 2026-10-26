'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  Batch,
  AttendanceRecord,
  FeeInvoice,
  Exam,
  Notice,
  InstituteSettings,
  AttendanceStatus,
} from '../types';
import {
  initialStudents,
  initialTeachers,
  initialBatches,
  initialAttendance,
  initialInvoices,
  initialExams,
  initialNotices,
  initialSettings,
} from '../data/mockData';
import { generateId } from '../utils';

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'batches'
  | 'teachers'
  | 'attendance'
  | 'fees'
  | 'exams'
  | 'timetable'
  | 'notices'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data
  students: Student[];
  teachers: Teacher[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  invoices: FeeInvoice[];
  exams: Exam[];
  notices: Notice[];
  settings: InstituteSettings;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Batch Actions
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // Attendance Actions
  saveAttendance: (batchId: string, date: string, records: { studentId: string; status: AttendanceStatus; note?: string }[]) => void;

  // Fee / Invoice Actions
  addInvoice: (invoice: Omit<FeeInvoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoice: (id: string, invoice: Partial<FeeInvoice>) => void;
  recordPayment: (id: string, paidAmount: number, paymentMethod: FeeInvoice['paymentMethod'], notes?: string) => void;
  deleteInvoice: (id: string) => void;

  // Exam Actions
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  saveExamResults: (examId: string, results: Exam['results']) => void;
  deleteExam: (id: string) => void;

  // Notice Actions
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  togglePinNotice: (id: string) => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<InstituteSettings>) => void;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'apex_coaching_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Entities state
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [invoices, setInvoices] = useState<FeeInvoice[]>(initialInvoices);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [settings, setSettings] = useState<InstituteSettings>(initialSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedStudents = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedTeachers = localStorage.getItem(`${STORAGE_KEY_PREFIX}teachers`);
      if (savedTeachers) setTeachers(JSON.parse(savedTeachers));

      const savedBatches = localStorage.getItem(`${STORAGE_KEY_PREFIX}batches`);
      if (savedBatches) setBatches(JSON.parse(savedBatches));

      const savedAttendance = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

      const savedInvoices = localStorage.getItem(`${STORAGE_KEY_PREFIX}invoices`);
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedExams = localStorage.getItem(`${STORAGE_KEY_PREFIX}exams`);
      if (savedExams) setExams(JSON.parse(savedExams));

      const savedNotices = localStorage.getItem(`${STORAGE_KEY_PREFIX}notices`);
      if (savedNotices) setNotices(JSON.parse(savedNotices));

      const savedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedTheme = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.warn('Failed to load data from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage on updates (after initial load)
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(batches));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [isInitialized, students, teachers, batches, attendance, invoices, exams, notices, settings]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, 'light');
      }
      return next;
    });
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: generateId('std'),
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Student "${newStudent.name}" enrolled successfully!`);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    showToast('Student information updated.');
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Student "${student?.name || ''}" removed.`, 'info');
  };

  // Teacher Actions
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: generateId('tch'),
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(`Teacher "${newTeacher.name}" added successfully.`);
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Teacher profile updated.');
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast('Teacher profile removed.', 'info');
  };

  // Batch Actions
  const addBatch = (batchData: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: generateId('bat'),
    };
    setBatches((prev) => [newBatch, ...prev]);
    showToast(`Batch "${newBatch.name}" created.`);
  };

  const updateBatch = (id: string, updatedFields: Partial<Batch>) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    showToast('Batch details updated.');
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    showToast('Batch deleted.', 'info');
  };

  // Attendance
  const saveAttendance = (
    batchId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; note?: string }[]
  ) => {
    setAttendance((prev) => {
      const existingIndex = prev.findIndex((a) => a.batchId === batchId && a.date === date);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], records };
        return copy;
      }
      return [{ id: generateId('att'), batchId, date, records }, ...prev];
    });
    showToast(`Attendance saved for ${date}`);
  };

  // Fees / Invoices
  const addInvoice = (inv: Omit<FeeInvoice, 'id' | 'invoiceNumber'>) => {
    const invCount = invoices.length + 1;
    const invoiceNumber = `${settings.invoicePrefix || 'INV-'}${String(invCount).padStart(4, '0')}`;
    const newInvoice: FeeInvoice = {
      ...inv,
      id: generateId('inv'),
      invoiceNumber,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Invoice ${invoiceNumber} created.`);
  };

  const updateInvoice = (id: string, fields: Partial<FeeInvoice>) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...fields } : i))
    );
    showToast('Invoice updated.');
  };

  const recordPayment = (
    id: string,
    paidAmount: number,
    paymentMethod: FeeInvoice['paymentMethod'],
    notes?: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const totalPaid = (inv.paidAmount || 0) + paidAmount;
          let newStatus: FeeInvoice['status'] = 'Paid';
          if (totalPaid <= 0) newStatus = 'Pending';
          else if (totalPaid < inv.amount) newStatus = 'Partial';

          return {
            ...inv,
            paidAmount: totalPaid,
            status: newStatus,
            paymentMethod,
            paymentDate: new Date().toISOString().split('T')[0],
            notes: notes ? `${inv.notes ? inv.notes + ' | ' : ''}${notes}` : inv.notes,
          };
        }
        return inv;
      })
    );
    showToast('Payment recorded successfully!');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast('Invoice deleted.', 'info');
  };

  // Exam Actions
  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: generateId('exm'),
    };
    setExams((prev) => [newExam, ...prev]);
    showToast(`Exam "${newExam.title}" scheduled.`);
  };

  const updateExam = (id: string, fields: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...fields } : e))
    );
    showToast('Exam updated.');
  };

  const saveExamResults = (examId: string, results: Exam['results']) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, results, status: 'Graded' } : e))
    );
    showToast('Exam marks submitted and report cards updated!');
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    showToast('Exam removed.', 'info');
  };

  // Notices
  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: generateId('not'),
    };
    setNotices((prev) => [newNotice, ...prev]);
    showToast('New announcement published.');
  };

  const updateNotice = (id: string, fields: Partial<Notice>) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...fields } : n))
    );
    showToast('Notice updated.');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast('Notice deleted.', 'info');
  };

  const togglePinNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<InstituteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Institute settings saved.');
  };

  const resetAllData = () => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setBatches(initialBatches);
    setAttendance(initialAttendance);
    setInvoices(initialInvoices);
    setExams(initialExams);
    setNotices(initialNotices);
    setSettings(initialSettings);

    localStorage.removeItem(`${STORAGE_KEY_PREFIX}students`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}teachers`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}batches`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}attendance`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}invoices`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}exams`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notices`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}settings`);

    showToast('Reset to default demo data completed.', 'info');
  };

  const exportDataJSON = () => {
    const payload = {
      settings,
      students,
      teachers,
      batches,
      attendance,
      invoices,
      exams,
      notices,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students) setStudents(data.students);
      if (data.teachers) setTeachers(data.teachers);
      if (data.batches) setBatches(data.batches);
      if (data.attendance) setAttendance(data.attendance);
      if (data.invoices) setInvoices(data.invoices);
      if (data.exams) setExams(data.exams);
      if (data.notices) setNotices(data.notices);
      if (data.settings) setSettings(data.settings);
      showToast('Data restored successfully!');
      return true;
    } catch (e) {
      showToast('Invalid JSON file format', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        isDarkMode,
        toggleDarkMode,
        students,
        teachers,
        batches,
        attendance,
        invoices,
        exams,
        notices,
        settings,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addBatch,
        updateBatch,
        deleteBatch,
        saveAttendance,
        addInvoice,
        updateInvoice,
        recordPayment,
        deleteInvoice,
        addExam,
        updateExam,
        saveExamResults,
        deleteExam,
        addNotice,
        updateNotice,
        deleteNotice,
        togglePinNotice,
        updateSettings,
        resetAllData,
        exportDataJSON,
        importDataJSON,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
