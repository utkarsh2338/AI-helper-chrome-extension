import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for user API keys (in production, use a database)
let userApiKey = null;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to get the AI instance with the appropriate API key
function getAI() {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("No API key configured. Please set up your Gemini API key in Settings.");
    }
    return new GoogleGenAI({ apiKey });
}

// Settings endpoints
app.get("/settings/apikey", (req, res) => {
    res.json({ hasKey: !!userApiKey });
});

app.post("/settings/apikey", (req, res) => {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
        return res.status(400).json({ error: "Invalid API key" });
    }

    userApiKey = apiKey.trim();
    res.json({ success: true, message: "API key saved successfully" });
});

app.delete("/settings/apikey", (req, res) => {
    userApiKey = null;
    res.json({ success: true, message: "API key removed" });
});

// Test API key endpoint
app.post("/test-key", async (req, res) => {
    try {
        const aiInstance = getAI();
        const response = await aiInstance.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Hello! Please respond with 'OK' if you receive this message."
        });

        res.json({ success: true, message: "API key is valid", response: response.text });
    } catch (error) {
        console.error("API key test failed:", error);
        res.status(400).json({
            error: error.message || "API key test failed. Please check your key and try again."
        });
    }
});

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
        const aiInstance = getAI();
        const response = await aiInstance.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            error: error.message || "Failed to get AI response"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});