import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/common/ToastContainer';

export const metadata: Metadata = {
  title: 'ApexCoach - Coaching & Academy Management Platform',
  description: 'Enterprise Coaching Center & Academy Management System for Batches, Students, Faculty, Attendance, Fees, Exams and Timetables.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
