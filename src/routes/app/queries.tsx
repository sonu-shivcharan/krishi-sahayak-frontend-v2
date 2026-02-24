import { createFileRoute } from '@tanstack/react-router'
import { FarmerQueriesView } from '@/components/farmer-dashboard/FarmerQueriesView'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useAppAuth } from "@/providers/AuthProvider"

export const Route = createFileRoute('/app/queries')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAppAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-semibold">My Queries</h1>
          </div>
        </header>
        <FarmerQueriesView />
      </SidebarInset>
    </SidebarProvider>
  )
}
