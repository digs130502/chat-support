import { NextResponse } from "next/server"; // Import NextResponse from Next.js for handling responses
import OpenAI from "openai"; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = (language) => `
1. You are a helpful and knowledgeable assistant. 
2. Your role is to provide accurate, concise, and thoughtful answers to any questions posed by the user. 
3. Be polite, professional, and aim to assist the user in the best way possible. 
4. If you don't know the answer to a question, do your best to provide guidance on where the user might find the information they need. 
5. Ensure that your responses are clear and free of jargon unless specifically requested by the user.
Respond in ${language === "es" ? "Spanish" : "English"}.
`;

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const { messages = [] , language = "en" } = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt(language) }, ...messages], // Include the system prompt and user messages
    model: "gpt-4o-mini", // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
