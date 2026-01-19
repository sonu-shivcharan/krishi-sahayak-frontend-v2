import { Button } from "./ui/button";

type ChatSession = {
  id: string;
  title: string;
  messages: Array<{ id: string; role: "user" | "assistant"; content: string }>;
};

type ChatSidebarProps = {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
};

export function ChatSidebar({
  chatSessions,
  currentChatId,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full" variant={"outline"}>
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chatSessions.map((chat) => (
          <Button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            variant={currentChatId === chat.id ? "secondary" : "ghost"}
            className="w-full justify-start p-3 h-auto font-normal"
          >
            <div className="truncate text-sm">{chat.title}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
