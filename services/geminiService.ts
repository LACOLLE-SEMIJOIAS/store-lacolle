
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Always use the recommended initialization with named parameter and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestions = async (userQuery: string, products: Product[]) => {
  const productListStr = products.map(p => `${p.name} (SKU: ${p.sku}, Categoria: ${p.category})`).join(', ');
  
  // Directly call generateContent with model name and prompt
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é o assistente virtual da La Colle & CO, uma loja de atacado de semijoias. 
    Responda em português. Ajude o cliente a encontrar produtos baseados na seguinte lista: ${productListStr}.
    A consulta do cliente é: "${userQuery}". 
    Seja elegante e direto. Se o cliente perguntar sobre tendências, sugira produtos da lista que combinem.`,
    config: {
      temperature: 0.7,
      // Removed maxOutputTokens to follow guidelines as thinkingBudget was not set
    },
  });

  // Use the .text property to access generated content
  return response.text;
};
