import React from "react";
import DataProvider from "@/components/providers/DataProvider";
import DashboardShell from "@/components/ui/DashboardShell";

export default async function DashboardPage() {
  // Server component: can do initial fetch/generation if desired.
  // For demo, we render DataProvider on client to manage initial generation there.
  return (
    <DataProvider>
      <DashboardShell />
    </DataProvider>
  );
}
