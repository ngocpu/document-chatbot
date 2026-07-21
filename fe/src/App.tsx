import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import InputBox from "@/components/InputBox";
import useChat from "@/hooks/useChat";

function App() {
  const { t } = useTranslation();
  const chat = useChat();
  const hasSession = chat.sessionId !== null;
  const hasStartedConversation = chat.messages.length > 0;

  const inputBox = (
    <InputBox
      fileName={chat.fileName}
      hasSession={hasSession}
      hasStartedConversation={hasStartedConversation}
      isUploading={chat.isUploading}
      isSending={chat.isSending}
      onUpload={chat.uploadFile}
      onSend={chat.sendMessage}
    />
  );

  return (
    <div className="app-layout flex h-screen bg-bg text-text">
      <Sidebar
        sessions={chat.sessions}
        activeSessionId={chat.sessionId}
        onSelectSession={chat.selectSession}
        onNewChat={chat.startNewChat}
        onRenameSession={chat.renameSession}
        onDeleteSession={chat.deleteSession}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {hasStartedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ChatArea messages={chat.messages} fileName={chat.fileName} />
            </div>
            <div className="flex w-full flex-col items-center bg-bg px-6 pt-4 pb-6">
              {inputBox}
              <p className="mt-2 text-center text-xs text-text-muted">
                {t("chat.disclaimer")}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            <ChatArea messages={chat.messages} fileName={chat.fileName} />
            {inputBox}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
