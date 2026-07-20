import { Router } from "express";
import multer from "multer";
import { extractText, isSupportedMimeType } from "../services/extractText";
import { chunkText } from "../services/chunking";
import { createSession } from "../storage/sessionStore";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded (expected field name "file")' });
    return;
  }

  if (!isSupportedMimeType(req.file.mimetype)) {
    res.status(400).json({ error: `Unsupported file type: ${req.file.mimetype}` });
    return;
  }

  try {
    const text = await extractText(req.file.buffer, req.file.mimetype);
    const chunks = chunkText(text);
    // busboy decodes multipart headers as latin1; re-decode as utf-8 to fix non-ASCII names.
    const fileName = Buffer.from(req.file.originalname, "latin1").toString("utf-8");
    const session = await createSession(fileName, chunks);
    res.json({
      sessionId: session.id,
      fileName: session.fileName,
      chunkCount: chunks.length,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
