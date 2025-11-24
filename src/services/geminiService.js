import { GoogleGenAI, Type } from '@google/genai'

/**
 * Generate a theme from a natural language prompt using Gemini AI
 * @param {string} prompt - User's description of the desired theme
 * @returns {Promise<object|null>} - Theme configuration or null on error
 */
export const generateThemeFromPrompt = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is missing in environment variables.')
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a visual theme for a 3D torus geometry based on this mood/description: "${prompt}".
      
      Return a JSON object with these fields:
      - meshColor (hex string)
      - wireframeColor (hex string)
      - backgroundColor (hex string)
      - roughness (number 0-1)
      - metalness (number 0-1)
      - animationSpeed (number 0.5-3.0)
      
      Ensure high contrast and aesthetic appeal.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meshColor: { type: Type.STRING },
            wireframeColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            roughness: { type: Type.NUMBER },
            metalness: { type: Type.NUMBER },
            animationSpeed: { type: Type.NUMBER },
          },
          required: ['meshColor', 'wireframeColor', 'backgroundColor', 'roughness', 'metalness', 'animationSpeed'],
        },
      },
    })

    if (response.text) {
      return JSON.parse(response.text)
    }
    return null
  } catch (error) {
    console.error('Gemini API Error:', error)
    return null
  }
}
