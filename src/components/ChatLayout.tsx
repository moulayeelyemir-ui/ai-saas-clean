"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

type Chat = {
  id: string;
  title: string;
};

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const currentChatTitle = useMemo(() => {
    const found = chats.find((c) => c.id === currentChatId);
    return found?.title ?? "AI Chat";
  }, [chats, currentChatId]);

  const loadChats = async () => {
    const res = await fetch("/api/chat", { method: "GET" });
    if (!res.ok) {
      throw new Error("Failed to load chats");
    }
    const data = (await res.json()) as Chat[];
    setChats(data);
    if (!currentChatId && data.length > 0) {
      setCurrentChatId(data[0].id);
    }
  };

  const loadMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/${chatId}/messages`, { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to load messages");
      }
      const data = (await res.json()) as Message[];
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }))
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    await loadMessages(chatId);
  };

  const handleNewChat = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Nouveau chat" }),
    });

    if (!res.ok) {
      return;
    }

    const created = (await res.json()) as Chat;
    setChats((prev) => [created, ...prev]);
    setCurrentChatId(created.id);
    setMessages([]);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadChats();
      } catch {
        // ignore: UI will show empty state
      } finally {
        if (!cancelled) setLoadingChats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentChatId) return;
    void loadMessages(currentChatId);
  }, [currentChatId]);

  return (
    <div className="flex h-full">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="flex min-w-0 flex-1 flex-col bg-black">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{currentChatTitle}</h2>
          {loadingChats && (
            <p className="mt-1 text-sm text-white/50">Chargement…</p>
          )}
        </div>

        {loadingMessages ? (
          <div className="flex-1 p-6 text-sm text-white/50">Chargement…</div>
        ) : (
          <ChatMessages messages={messages} />
        )}

        <ChatInput
          messages={messages}
          setMessages={setMessages}
          currentChatId={currentChatId}
        />
      </div>
    </div>
  );
}