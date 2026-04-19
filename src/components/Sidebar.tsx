"use client";

type Chat = {
  id: string;
  title: string;
};

type SidebarProps = {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
};

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  return (
    <div className="w-64 border-r border-white/10 bg-black p-4">
      <h2 className="mb-4 text-lg font-bold text-white">💬 Conversations</h2>

      <button
        onClick={onNewChat}
        className="mb-4 w-full rounded-lg bg-white p-2 text-black"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {chats.length === 0 && (
          <p className="text-sm text-white/50">Aucune conversation</p>
        )}

        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full rounded-lg p-2 text-left transition ${
              currentChatId === chat.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
}