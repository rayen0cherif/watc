import { StudentSidebar } from "@/components/student/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <StudentSidebar />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}
