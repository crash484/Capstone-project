import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildLLMPrompt } from "@/lib/promptBuilder";
import type { Recommendation } from "@/lib/recommendationEngine";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { userId, recommendations, userQuestion }: { 
      userId: string; 
      recommendations: Recommendation[]; 
      userQuestion: string; 
    } = await request.json();

    if (!userId || !recommendations?.length || !userQuestion) {
      return NextResponse.json(
        { error: "Missing userId, recommendations, or userQuestion" }, 
        { status: 400 }
      );
    }

    // compute top categories
    const userTopCategories = Array.from(new Set(recommendations.map(r => r.product.category)));

    // build prompt
    const prompt = buildLLMPrompt({ userId, topCategories: userTopCategories, recommendations, userQuestion });

    // call Groq LLM
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const responseMessage = chatCompletion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
