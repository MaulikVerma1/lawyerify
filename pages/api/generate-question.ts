import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { topic } = req.body;
      console.log("Received topic:", topic);

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are an LSAT expert. Generate a realistic LSAT ${topic} question. The question should be challenging and similar in style and difficulty to actual LSAT questions. Provide four answer options (A, B, C, D), the correct answer, and a detailed explanation. Format the response EXACTLY as follows, including newlines:

Question: [Your generated question here]

A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]

Correct Answer: [Letter of correct answer]

Explanation: [Your detailed explanation here]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("API Generated content:", text);
      res.status(200).json({ result: text });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: 'Error generating question', details: error.message, stack: error.stack });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
