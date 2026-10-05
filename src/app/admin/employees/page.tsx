import type { Metadata } from "next";
import { getAllEmployees } from "@/lib/employees";
import { PageHeader } from "@/components/admin/ui";
import { EmployeeManager } from "@/components/admin/EmployeeManager";

export const metadata: Metadata = { title: "Employees" };

export default async function AdminEmployeesPage() {
  const employees = await getAllEmployees();
  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Team members managed here. Active employees can be shown on public-facing pages."
      />
      <EmployeeManager employees={employees} />
    </>
  );
}
