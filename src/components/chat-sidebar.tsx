import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { PlusIcon, MessageSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col h-full">
      <div className="p-4 border-b">
        <Button asChild className="w-full justify-start gap-2" variant="outline">
          <Link to="/chat">
            <PlusIcon className="w-4 h-4" />
            New Chat
          </Link>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && chatSessions.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Loading conversations...
          </div>
        ) : chatSessions.length === 0 ? (
           <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          chatSessions.map((chat) => (
            <Button
              key={chat.id}
              asChild
              variant={currentChatId === chat.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 font-normal gap-2",
                currentChatId === chat.id ? "bg-secondary" : ""
              )}
            >
              <Link to="/c/$chatId" params={{ chatId: chat.id }}>
                <MessageSquareIcon className="w-4 h-4 shrink-0 opacity-70" />
                <div className="truncate text-sm">{chat.title}</div>
              </Link>
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
