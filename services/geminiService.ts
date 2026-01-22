
import { GoogleGenAI, Type } from "@google/genai";
import { BlockColor, StrategicHint, GRID_SIZE } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStrategicHint = async (
  grid: BlockColor[][],
  score: number,
  moves: number,
  directive: string
): Promise<StrategicHint> => {
  // Convert grid to a compact string format for the prompt
  const gridString = grid.map(row => row.map(c => c[0].toUpperCase()).join('')).join('\n');

  const systemInstruction = `
    You are a world-class Tactical Co-pilot for a grid-based match-3 game.
    Grid Size: ${GRID_SIZE}x${GRID_SIZE}.
    Colors: R(ed), B(lue), G(reen), Y(ellow), P(urple).
    Rules: Players clear blocks by clicking clusters of 2 or more identical adjacent colors.
    Your Goal: Provide the single best move to maximize score or fulfill the user's "Tactical Directive".
    
    CRITICAL: If a "Tactical Directive" is provided below, PRIORITIZE IT ABOVE ALL ELSE. 
    Even if it seems suboptimal for score, follow the user's intent.
  `;

  const userPrompt = `
    CURRENT GAME STATE:
    Score: ${score}
    Moves Remaining: ${moves}
    Grid:
    ${gridString}

    TACTICAL DIRECTIVE:
    "${directive || 'None. Optimize for maximum score.'}"

    Analyze the grid and return the best move in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.INTEGER },
                y: { type: Type.INTEGER }
              },
              required: ["x", "y"]
            },
            action: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["target", "action", "reasoning", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as StrategicHint;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      target: { x: 0, y: 0 },
      action: "System Error",
      reasoning: "The tactical link failed. Proceed with caution.",
      confidence: 0
    };
  }
};
