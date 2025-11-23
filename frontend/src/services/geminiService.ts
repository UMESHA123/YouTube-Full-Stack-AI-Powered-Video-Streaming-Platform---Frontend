import { GoogleGenAI } from "@google/genai";
import type { Comment, Video } from '../types';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyB_vj5MIYeQ5HgNYtoQtJu7zTS6RztYRMQ' });

export const analyzeComments = async (comments: Comment[], prompt: string): Promise<{ text: string; suggestedTags: string[] }> => {
  const commentsText = comments.map(c => `${c.username}: ${c.text} (Likes: ${c.likes})`).join('\n');
  
  const fullPrompt = `
    You are an AI community manager for a video platform. 
    Here are the comments from a video:
    ${commentsText}

    User Query/Task: ${prompt}

    Please provide a concise response answering the query based on the comments provided.
    Also, suggest 3 short, relevant follow-up query tags (max 3 words each) for the user to click next.
    
    Format the output as JSON:
    {
      "response": "string",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const responseText = result.text;
    if (!responseText) return { text: "Could not analyze comments.", suggestedTags: [] };
    
    const parsed = JSON.parse(responseText);
    return { text: parsed.response, suggestedTags: parsed.tags || [] };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Sorry, I encountered an error analyzing the comments.", suggestedTags: [] };
  }
};

export const chatAboutVideo = async (video: Video, query: string): Promise<{ text: string; suggestedTags: string[] }> => {
  const fullPrompt = `
    You are a helpful video assistant.
    Video Title: ${video.title}
    Video Description: ${video.description}
    Channel: ${video.channelName}
    Category: ${video.category}

    User Question: ${query}

    Answer the user's question based on the metadata provided above. Keep it helpful and concise.
    Also, suggest 3 short, relevant follow-up questions or tags regarding this video.

    Format the output as JSON:
    {
      "response": "string",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const responseText = result.text;
    if (!responseText) return { text: "I couldn't generate a response.", suggestedTags: [] };
    const parsed = JSON.parse(responseText);
    return { text: parsed.response, suggestedTags: parsed.tags || [] };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Sorry, I'm having trouble connecting to the brain right now.", suggestedTags: [] };
  }
};

export const generateThumbnailPrompts = async (title: string, userPrompt: string): Promise<string[]> => {
    // This function doesn't actually generate the image (which would require an image model),
    // but it validates that we can use the API to refine the prompt before "simulating" the generation in the UI.
    // In a real production app with Imagen access, we would call ai.models.generateImages here.
    
    const fullPrompt = `
        Refine this image prompt for a youtube video thumbnail to make it more descriptive and artistic.
        Video Title: ${title}
        User Idea: ${userPrompt}
        
        Just return the refined prompt string.
    `;
    
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return [result.text || userPrompt];
    } catch (e) {
        return [userPrompt];
    }
};