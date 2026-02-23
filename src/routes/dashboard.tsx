import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component:  Dashboard,
})

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { OfficerDashboardView } from "@/components/officer-dashboard/OfficerDashboardView"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAppAuth } from "@/providers/AuthProvider"

export default function Dashboard() {
  const { user } = useAppAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex sticky top-0 z-10 bg-background h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {user?.role === 'officer' ? "Officer Dashboard" : "Build Your Application"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{user?.role === 'officer' ? "Incoming Queries" : "Data Fetching"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {user?.role === 'officer' ? (
           <OfficerDashboardView />
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

