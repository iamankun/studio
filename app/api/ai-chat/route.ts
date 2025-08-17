import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Content } from "@google/genai";

// Tôi là An Kun
// Hỗ trợ dự án, Copilot, Gemini
// Tác giả kiêm xuất bản bởi An Kun Studio Digital Music

const ANKUN_CONTEXT = `
An Kun Studio là một công ty phân phối nhạc số và hỗ trợ nghệ sĩ. 
Được thành lập bởi An Kun, công ty cung cấp các dịch vụ:
- Phân phối nhạc số đến các nền tảng như Spotify, Apple Music, YouTube Music
- Quản lý bản quyền và thu thập royalty
- Hỗ trợ quảng bá và tiếp thị âm nhạc
- Sản xuất và thu âm chuyên nghiệp

Chỉ trả lời các câu hỏi liên quan đến An Kun Studio, âm nhạc, và phân phối nhạc số. 
Nếu câu hỏi không liên quan, lịch sự từ chối trả lời và đề xuất hỏi về các dịch vụ của An Kun Studio.
`;

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("Gemini API key is not configured");
            return NextResponse.json(
                { error: "AI service is not configured correctly." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { messages } = body as { messages: Array<{ role: 'user' | 'assistant'; content: string }> };

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request format: 'messages' array is required." },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        // Transform messages for Gemini API
        const contents: Content[] = messages
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: ANKUN_CONTEXT,
            }
        });

        const text = response.text;

        return NextResponse.json({
            response: text ?? "Không nhận được phản hồi từ AI",
        });
        
    } catch (error) {
        console.error("AI chat API error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error from AI service";
        return NextResponse.json(
            { error: "An error occurred while processing the AI request: " + errorMessage },
            { status: 500 }
        );
    }
}