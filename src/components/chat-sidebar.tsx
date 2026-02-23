import { PlusIcon, MessageSquareIcon, Search, LayoutDashboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useAppAuth } from "@/providers/AuthProvider";
import { Input } from "./ui/input";

type ChatSession = {
  id: string;
  title: string;
};

type ChatSidebarProps = {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  isLoading?: boolean;
};

export function ChatSidebar({
  chatSessions,
  currentChatId,
  isLoading,
}: ChatSidebarProps) {
  const { user } = useAppAuth();

  const sidebarUser = {
    name: user?.name || "Guest",
    email: user?.email || "",
    avatar: "/avatars/user.jpg", // Default avatar or user avatar if available
  };

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r">
      <SidebarHeader className="p-4 gap-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
            <MessageSquareIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">Krishi AI</span>
        </div>
        
        <div className="flex flex-col gap-2">
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="outline" className="w-full justify-start gap-2 h-10 border-dashed hover:border-solid bg-background">
                <Link to="/chat">
                  <PlusIcon className="w-4 h-4" />
                  <span className="font-medium">New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 mb-1">Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && chatSessions.length === 0 ? (
                <div className="px-4 py-8 text-center bg-muted/30 rounded-lg mx-2 border border-dashed flex flex-col items-center gap-2">
                   <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   <p className="text-xs text-muted-foreground">Loading chats...</p>
                </div>
              ) : chatSessions.length === 0 ? (
                <div className="px-4 py-8 text-center bg-muted/30 rounded-lg mx-2 border border-dashed">
                  <p className="text-xs text-muted-foreground font-medium">No sessions yet</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Start your first conversation!</p>
                </div>
              ) : (
                chatSessions.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentChatId === chat.id}
                      tooltip={chat.title}
                      className={cn(
                        "h-11 transition-all duration-200 group-data-[state=collapsed]:justify-center",
                        currentChatId === chat.id 
                          ? "bg-primary/5 text-primary border-r-2 border-primary rounded-r-none" 
                          : "hover:bg-muted/80"
                      )}
                    >
                      <Link to="/c/$chatId" params={{ chatId: chat.id }}>
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0 transition-all",
                          currentChatId === chat.id ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                        )} />
                        <span className="truncate flex-1">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-muted-foreground hover:text-foreground">
                   <Link to="/dashboard">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Back to Dashboard</span>
                   </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t bg-muted/20">
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
