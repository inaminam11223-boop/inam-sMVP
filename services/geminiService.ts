
import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";

export const geminiService = {
  async generatePromotion(productName: string, businessType: string) {
    try {
      // Fixed: Initializing with API key directly from process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a catchy, high-conversion marketing promotion for a product named "${productName}" from a "${businessType}" business in Pakistan. Use localized persuasive language (English/Urdu mix where effective). Mention price in PKR. Keep it under 100 words and use emojis appropriate for Pakistani social media. Promote as part of the MY BUSSINESS network.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Special offer available at MY BUSSINESS! High quality product at best price. Visit us today!";
    }
  },

  async getBusinessInsights(data: any) {
    try {
      // Fixed: Initializing with API key directly from process.env.API_KEY as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this business data for a Pakistani small business: ${JSON.stringify(data)}. Provide 3 concrete, actionable growth tips. Focus on local market trends, inventory optimization, and customer retention within the MY BUSSINESS ecosystem. Keep it concise.`,
      });
      return response.text;
    } catch (error) {
      return "Focus on increasing stock for high-demand items like Basmati Rice and running a weekend promotion for local customers.";
    }
  },

  createChat(role: UserRole, userName: string, businessName?: string) {
    // Fixed: Initializing with API key directly from process.env.API_KEY as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let instruction = "";

    switch (role) {
      case UserRole.SUPER_ADMIN:
        instruction = `You are the MY BUSSINESS Platform Guru for Inam Khan. You help manage the entire Pakistani business ecosystem. Provide high-level insights on business approvals, platform revenue, and strategic growth across Pakistan.`;
        break;
      case UserRole.BUSINESS_ADMIN:
        instruction = `You are a localized Business Growth Expert in Pakistan. Help ${userName} (owner of ${businessName}) manage inventory on MY BUSSINESS, optimize Pakistani sales, explain bargaining tactics, and create marketing campaigns for PKR transactions.`;
        break;
      case UserRole.STAFF:
        instruction = `You are an Operations Efficiency Assistant for MY BUSSINESS. Help staff members like ${userName} with task management, explaining order lifecycle, and improving customer service speed in a busy Pakistani retail/service environment.`;
        break;
      case UserRole.CUSTOMER:
        instruction = `You are a friendly Pakistani Shopping Assistant for ${userName} on MY BUSSINESS. Help find the best deals, explain how to bargain effectively on the platform, track orders, and discover new verified shops in Peshawar, Lahore, or Karachi.`;
        break;
    }

    return ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: instruction,
      },
    });
  }
};
