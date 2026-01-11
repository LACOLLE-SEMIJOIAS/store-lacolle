
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY.
// The SDK initialization must follow the world-class senior frontend engineer guidelines.
export const getSmartSuggestions = async (userQuery: string, products: Product[]) => {
  // Use process.env.API_KEY directly for client initialization.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const productListStr = products.map(p => `${p.name} (SKU: ${p.sku}, Categoria: ${p.category})`).join(', ');
  
  try {
    // Generate content by calling ai.models.generateContent with model and contents.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é o assistente virtual da La Colle & CO, uma loja de atacado de semijoias. 
      Responda em português. Ajude o cliente a encontrar produtos baseados na seguinte lista: ${productListStr}.
      A consulta do cliente é: "${userQuery}". 
      Seja elegante e direto. Se o cliente perguntar sobre tendências, sugira produtos da lista que combinem.`,
      config: {
        temperature: 0.7,
      },
    });

    // The text content is obtained via the .text property (not a method call).
    return response.text;
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Tive um probleminha para processar sua sugestão. Pode tentar de novo?";
  }
};
