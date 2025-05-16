import { ChatHeader } from "@/components/ChatHeader";
import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <MessageList />
        </div>
        <MessageInput />
      </main>
    </div>
  );
}
