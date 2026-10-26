# 🎓 ApexCoach - Coaching & Academy Management System

An enterprise-grade, modern, and responsive Coaching Management System designed for coaching centers, academies, tuition institutes, and test-prep organizations. Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

Ready for instant deployment on **Vercel** with zero backend configuration needed.

---

## 🌟 Key Features

### 1. 📊 Executive Analytics & Dashboard
- **Real-Time KPIs**: Total enrolled students, active batches, fees collected, pending balances, and attendance compliance rate.
- **Today's Class Schedule**: Quick overview of running classes, room allocations, times, and faculty.
- **Recent Billing**: Live transaction feed with 1-click receipt generation.
- **Institute Highlights**: Capacity bars and collection progress indicators.

### 2. 👨‍🎓 Comprehensive Student Directory
- Student database with admission records, contact details, emergency parent/guardian information, and enrollment status.
- **360° Student Profile Modal**: View complete academic history, enrolled batches, attendance percentage, and tuition invoices.
- **Official Student ID Card Generator**: Printable identity card with barcode/QR badge simulation, custom branding, and 1-click print support.

### 3. 📚 Batches & Course Management
- Configure course schedules, assigned instructors, lecture halls/rooms, capacity limits, and monthly tuition fees.
- Real-time seat occupancy visualization (e.g. 22/25 seats filled).
- Dynamic student enrollment mapping.

### 4. 👨‍🏫 Faculty & Teachers Management
- Faculty directory with academic qualifications, departments, assigned batches, and remuneration tracking.
- Direct batch-to-instructor linkage.

### 5. 📅 Daily Attendance Register
- Batch-wise and date-wise attendance taking.
- Individual student status toggles: **Present**, **Absent**, **Late**, **Excused** with optional custom notes.
- Quick bulk actions (**All Present**, **All Absent**).
- Automatic attendance percentage calculations.

### 6. 💳 Fees, Invoices & Billing
- Tuition invoice generation with automatic invoice numbering (`INV-2025-XXXX`).
- Multi-status tracking: **Paid**, **Pending**, **Partial**, and **Overdue**.
- Record payments with support for **Online / UPI**, **Card**, **Cash**, and **Bank Transfer**.
- **Printable Fee Receipts**: Letterhead receipt voucher with student details, itemized fee breakdown, authorized signature line, and "PAID" stamp watermark.

### 7. 📝 Examinations, Grading & Report Cards
- Schedule tests and exams with total marks and passing threshold.
- Interactive mark entry system with automatic letter grade calculation (`A+`, `A`, `B`, `C`, `D`, `F`) and percentage.
- **Official Student Report Card**: Printable academic evaluation transcript ready for parents.

### 8. 🗓️ Interactive Weekly Class Timetable
- Multi-day calendar view (Monday through Sunday).
- Filterable by Batch and by Faculty member.
- Room assignments and class timing slots.

### 9. 📢 Institute Notice Board
- Broadcast notices with priority tagging (**Urgent**, **High**, **Medium**, **Low**) and targeted audiences (**All**, **Students**, **Parents**, **Teachers**).
- Pin important announcements to the top.

### 10. ⚙️ Academy Configuration & Data Portability
- Customize Institute Name, Tagline, Logo, Address, Contact Info, Currency Symbol, and Academic Year.
- **1-Click JSON Backup & Restore**: Download complete data backups or restore to factory demo data with one click.
- **Dark Mode / Light Mode**: Beautiful UI with persistent theme toggle.

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** (or yarn / pnpm)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd coaching-management-system

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deploy to Vercel (1-Click Deployment)

This application is optimized for **Vercel** serverless hosting with static pre-rendering and client-side persistence:

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **"Add New..."** &rarr; **"Project"**.
4. Import your GitHub repository (`coaching-management-system`).
5. Keep default build settings (`Framework: Next.js`, `Build Command: next build`).
6. Click **Deploy**. Your coaching management system will be live worldwide in under 60 seconds!

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **State & Storage**: React Context API with LocalStorage Synchronization
- **Print Styles**: Native CSS Print Media Queries for physical receipts and ID cards

---

## 📄 License
MIT License. Built for seamless educational institute operations.
