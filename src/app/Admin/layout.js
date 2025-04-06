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
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar always visible */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </MeetingProvider>
  );
}
