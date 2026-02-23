"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Radio,
  Sprout,
} from "lucide-react"
import { Link } from "@tanstack/react-router"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "Krishi Sahayak",
      logo: Sprout,
      plan: "Digital Assistant",
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: any }) {
  const sidebarUser = {
    name: user?.name || "Guest",
    email: user?.email || "",
    avatar: user?.profileImage || "",
  }

  const isOfficer = user?.role === "officer"
  
  const navMain = [
    {
      title: "Home",
      url: isOfficer ? "/dashboard" : "/app",
      icon: LayoutDashboard,
    },
    {
      title: "AI Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Live Support",
      url: "/chat-live",
      icon: Radio,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
