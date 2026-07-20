import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { uploadRouter } from "./routes/upload";
import { chatRouter } from "./routes/chat";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(uploadRouter);
app.use(chatRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
