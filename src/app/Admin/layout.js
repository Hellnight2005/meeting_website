// app/Admin/layout.js
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage events and projects",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Page content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
