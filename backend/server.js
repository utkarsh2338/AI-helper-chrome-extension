import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/ask", async (req, res) => {
    const { context } = req.body;

    // Build context-aware prompt
    let prompt = `You are helping a stu dent fill an internship application.

Context:
- Website: ${context.domain}
- Page: ${context.pageTitle}`;

    if (context.label) {
        prompt += `\n- Form field label: ${context.label}`;
    }
    if (context.placeholder) {
        prompt += `\n- Field placeholder: ${context.placeholder}`;
    }

    prompt += `\n\nQuestion to answer:\n"${context.question}"\n\nProvide a professional, concise answer suitable for an internship application:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to get AI response" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});