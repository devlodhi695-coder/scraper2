import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Helper to generate a realistic looking Flipkart ID
const generateId = () => Math.random().toString(36).substring(7);

export const scrapeFlipkartData = async (query: string, pages: number): Promise<Product[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We simulate pagination by requesting more items. 
  // Real scraping would loop through URLs, but here we ask the model to generate a dataset.
  const totalItemsToFetch = pages * 10; 

  const prompt = `
    Generate a realistic JSON dataset of ${totalItemsToFetch} products that would appear on Flipkart for the search query: "${query}".
    
    The data must include:
    - name: A realistic product title.
    - price: Current selling price in INR (number).
    - originalPrice: Original price before discount in INR (number).
    - rating: A number between 1.0 and 5.0.
    - reviewCount: A realistic integer number of reviews.
    - discount: The percentage discount (integer).
    - productUrl: A dummy URL starting with https://www.flipkart.com/...
    - imageUrl: A placeholder image URL (use https://picsum.photos/200/200?random=NUMBER).

    Strictly adhere to the JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              originalPrice: { type: Type.NUMBER },
              rating: { type: Type.NUMBER },
              reviewCount: { type: Type.INTEGER },
              discount: { type: Type.INTEGER },
              productUrl: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
            },
            required: ["name", "price", "rating", "reviewCount", "discount", "productUrl", "imageUrl", "originalPrice"],
          },
        },
      },
    });

    const textData = response.text;
    if (!textData) {
      return [];
    }

    const parsedData = JSON.parse(textData) as Omit<Product, 'id'>[];
    
    // Add IDs for React keys
    return parsedData.map(item => ({
      ...item,
      id: generateId()
    }));

  } catch (error) {
    console.error("Simulation error:", error);
    throw new Error("Failed to retrieve data. Please try again.");
  }
};

export const generatePlaceholderImage = async (productName: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { 
            text: `Generate a clean, high-quality, white-background product image for: ${productName}. The image should be suitable for an e-commerce listing.` 
          },
        ],
      },
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};
