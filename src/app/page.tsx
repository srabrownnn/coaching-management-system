'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, Batch, Teacher, Exam } from '@/types';

// Layout
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Main Views
import { DashboardView } from '@/components/dashboard/DashboardView';
import { StudentListView } from '@/components/students/StudentListView';
import { BatchListView } from '@/components/batches/BatchListView';
import { TeacherListView } from '@/components/teachers/TeacherListView';
import { AttendanceView } from '@/components/attendance/AttendanceView';
import { FeesView } from '@/components/fees/FeesView';
import { ExamsView } from '@/components/exams/ExamsView';
import { TimetableView } from '@/components/timetable/TimetableView';
import { NoticesView } from '@/components/notices/NoticesView';
import { SettingsView } from '@/components/settings/SettingsView';

// Modals
import { StudentModal } from '@/components/students/StudentModal';
import { StudentDetailModal } from '@/components/students/StudentDetailModal';
import { StudentIdCardModal } from '@/components/students/StudentIdCardModal';
import { BatchModal } from '@/components/batches/BatchModal';
import { TeacherModal } from '@/components/teachers/TeacherModal';
import { FeePaymentModal } from '@/components/fees/FeePaymentModal';
import { FeeReceiptModal } from '@/components/fees/FeeReceiptModal';
import { ExamModal } from '@/components/exams/ExamModal';
import { ExamGradingModal } from '@/components/exams/ExamGradingModal';
import { ReportCardModal } from '@/components/exams/ReportCardModal';

export default function Home() {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal States
  // Students
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [selectedIdCardStudent, setSelectedIdCardStudent] = useState<Student | null>(null);

  // Batches
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);

  // Teachers
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

  // Fees
  const [isFeePaymentModalOpen, setIsFeePaymentModalOpen] = useState(false);
  const [feeModalMode, setFeeModalMode] = useState<'collect' | 'create'>('collect');
  const [invoiceIdToPay, setInvoiceIdToPay] = useState<string | null>(null);
  const [isFeeReceiptOpen, setIsFeeReceiptOpen] = useState(false);
  const [selectedReceiptInvoiceId, setSelectedReceiptInvoiceId] = useState<string | null>(null);

  // Exams
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isExamGradingOpen, setIsExamGradingOpen] = useState(false);
  const [examToGrade, setExamToGrade] = useState<Exam | null>(null);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [examForReportCard, setExamForReportCard] = useState<Exam | null>(null);

  // Student handlers
  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenDetailStudent = (student: Student) => {
    setSelectedDetailStudent(student);
    setIsStudentDetailOpen(true);
  };

  const handleOpenIdCard = (student: Student) => {
    setSelectedIdCardStudent(student);
    setIsIdCardOpen(true);
  };

  // Batch handlers
  const handleOpenAddBatch = () => {
    setBatchToEdit(null);
    setIsBatchModalOpen(true);
  };

  const handleOpenEditBatch = (batch: Batch) => {
    setBatchToEdit(batch);
    setIsBatchModalOpen(true);
  };

  // Teacher handlers
  const handleOpenAddTeacher = () => {
    setTeacherToEdit(null);
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (teacher: Teacher) => {
    setTeacherToEdit(teacher);
    setIsTeacherModalOpen(true);
  };

  // Fee handlers
  const handleOpenCreateInvoice = () => {
    setFeeModalMode('create');
    setInvoiceIdToPay(null);
    setIsFeePaymentModalOpen(true);
  };

  const handleOpenPayment = (invoiceId?: string) => {
    setFeeModalMode('collect');
    setInvoiceIdToPay(invoiceId || null);
    setIsFeePaymentModalOpen(true);
  };

  const handleOpenReceipt = (invoiceId: string) => {
    setSelectedReceiptInvoiceId(invoiceId);
    setIsFeeReceiptOpen(true);
  };

  // Exam handlers
  const handleOpenScheduleExam = () => {
    setIsExamModalOpen(true);
  };

  const handleOpenGradeExam = (exam: Exam) => {
    setExamToGrade(exam);
    setIsExamGradingOpen(true);
  };

  const handleOpenReportCard = (exam: Exam) => {
    setExamForReportCard(exam);
    setIsReportCardOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-gray-950 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenEnrollModal={handleOpenAddStudent}
              onOpenFeePaymentModal={handleOpenPayment}
              onSelectReceipt={handleOpenReceipt}
            />
          )}

          {activeTab === 'students' && (
            <StudentListView
              onAddStudent={handleOpenAddStudent}
              onEditStudent={handleOpenEditStudent}
              onViewStudent={handleOpenDetailStudent}
              onViewIdCard={handleOpenIdCard}
            />
          )}

          {activeTab === 'batches' && (
            <BatchListView
              onAddBatch={handleOpenAddBatch}
              onEditBatch={handleOpenEditBatch}
            />
          )}

          {activeTab === 'teachers' && (
            <TeacherListView
              onAddTeacher={handleOpenAddTeacher}
              onEditTeacher={handleOpenEditTeacher}
            />
          )}

          {activeTab === 'attendance' && <AttendanceView />}

          {activeTab === 'fees' && (
            <FeesView
              onOpenCreateInvoice={handleOpenCreateInvoice}
              onOpenPaymentModal={handleOpenPayment}
              onOpenReceiptModal={handleOpenReceipt}
            />
          )}

          {activeTab === 'exams' && (
            <ExamsView
              onScheduleExam={handleOpenScheduleExam}
              onGradeExam={handleOpenGradeExam}
              onOpenReportCard={handleOpenReportCard}
            />
          )}

          {activeTab === 'timetable' && <TimetableView />}

          {activeTab === 'notices' && <NoticesView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals Container */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentToEdit={studentToEdit}
      />

      <StudentDetailModal
        isOpen={isStudentDetailOpen}
        onClose={() => setIsStudentDetailOpen(false)}
        student={selectedDetailStudent}
        onOpenIdCard={handleOpenIdCard}
      />

      <StudentIdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        student={selectedIdCardStudent}
      />

      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        batchToEdit={batchToEdit}
      />

      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        teacherToEdit={teacherToEdit}
      />

      <FeePaymentModal
        isOpen={isFeePaymentModalOpen}
        onClose={() => setIsFeePaymentModalOpen(false)}
        invoiceIdToPay={invoiceIdToPay}
        mode={feeModalMode}
      />

      <FeeReceiptModal
        isOpen={isFeeReceiptOpen}
        onClose={() => setIsFeeReceiptOpen(false)}
        invoiceId={selectedReceiptInvoiceId}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />

      <ExamGradingModal
        isOpen={isExamGradingOpen}
        onClose={() => setIsExamGradingOpen(false)}
        exam={examToGrade}
      />

      <ReportCardModal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        exam={examForReportCard}
      />
    </div>
  );
}
