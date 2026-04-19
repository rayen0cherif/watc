import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="student">
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
