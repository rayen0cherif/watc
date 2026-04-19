import { SupervisorSidebar } from "@/components/supervisor/sidebar";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SupervisorSidebar />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}
