import { createFileRoute } from '@tanstack/react-router'
import { FarmerDashboardView } from "@/components/farmer-dashboard/FarmerDashboardView"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAppAuth } from "@/providers/AuthProvider"

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAppAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <FarmerDashboardView />
      </SidebarInset>
    </SidebarProvider>
  )
}
