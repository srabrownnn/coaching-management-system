export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'On Leave';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  gradeOrClass: string;
  enrolledBatchIds: string[];
  admissionDate: string;
  avatarUrl?: string;
  status: StudentStatus;
  notes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatarUrl?: string;
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  subject: string;
  teacherId: string;
  teacherName?: string;
  scheduleDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "11:30 AM"
  room: string;
  capacity: number;
  monthlyFee: number;
  status: 'Active' | 'Upcoming' | 'Completed';
  description?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  records: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Overdue';
export type PaymentMethod = 'Cash' | 'Card' | 'Online / UPI' | 'Bank Transfer';

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  batchId: string;
  batchName: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  notes?: string;
}

export interface ExamResult {
  studentId: string;
  marksObtained: number;
  feedback?: string;
}

export interface Exam {
  id: string;
  title: string;
  batchId: string;
  batchName: string;
  subject: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  results: ExamResult[];
  status: 'Scheduled' | 'Graded' | 'Cancelled';
}

export type NoticePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type NoticeAudience = 'All' | 'Students' | 'Teachers' | 'Parents';

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: NoticePriority;
  audience: NoticeAudience;
  date: string;
  author: string;
  pinned: boolean;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  currency: string;
  currencySymbol: string;
  academicYear: string;
  receiptPrefix: string;
  invoicePrefix: string;
  logoUrl?: string;
}
