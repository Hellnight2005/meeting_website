// app/Admin/layout.js
"use client";

import Sidebar from "@/components/Sidebar";
import { MeetingProvider } from "@/constants/MeetingContext";

// export const metadata = {
//   title: "Admin Dashboard",
//   description: "Manage events and projects",
// };

export default function AdminLayout({ children }) {
  return (
    <MeetingProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </MeetingProvider>
  );
}
