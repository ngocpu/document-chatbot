# document-qa-chatbot

Hệ thống chatbot hỏi-đáp tài liệu (RAG rút gọn) — đồ án thực tập tốt nghiệp.

Upload tài liệu → chunking → retrieval → gọi Claude API → trả lời kèm trích dẫn nguồn.

## Cấu trúc thư mục

```
fe/      Frontend — React (Vite) + TypeScript
server/  Backend — Node.js (Express) + TypeScript
```

### fe/
- `src/components/` — Sidebar, ChatArea, MessageBubble, SourceCitation, InputBox
- `src/hooks/useChat.ts` — logic gọi API, quản lý state hội thoại

### server/
- `src/routes/` — upload, chat
- `src/services/` — extractText, chunking, retrieval, claudeClient
- `src/storage/sessionStore.ts` — lưu/load session (JSON file)
- `src/server.ts` — entry point Express (`npm run dev` để chạy, `npm run build` để biên dịch)

## Ghi chú
Thư mục `human-workspace/` là nơi làm việc cá nhân với Claude Code (`user_prompt/` +
`agent/`), không có trong repo git (xem `.gitignore`).
