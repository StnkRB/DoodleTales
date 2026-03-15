import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from "@google/genai";
import { AIService, Character, ChatService, ChatCallbacks } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Tool Definitions ---

const highlightCharacterTool: FunctionDeclaration = {
  name: "highlight_character",
  parameters: {
    type: Type.OBJECT,
    description: "Highlights a character in the drawing. Use this before discussing them.",
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the character." },
    },
    required: ["id"],
  },
};

const generateStoryImageTool: FunctionDeclaration = {
  name: "generate_story_image",
  parameters: {
    type: Type.OBJECT,
    description: "Generates a new scene. This tool uses the original drawing as a 'Style Reference' to keep characters and art style identical.",
    properties: {
      prompt: {
        type: Type.STRING,
        description: "Describe the new action. Mention characters by name and describe their unique visual traits from the original drawing (e.g., 'the girl with the 3 yellow hair spikes').",
      },
      characterDetails: {
        type: Type.STRING,
        description: "A summary of known characters (names/roles) to ensure the AI doesn't forget their appearance.",
      }
    },
    required: ["prompt"],
  },
};

const updateCharacterInfoTool: FunctionDeclaration = {
  name: "update_character_info",
  parameters: {
    type: Type.OBJECT,
    description: "Updates stored info. Use this as soon as the child gives a character a name or role.",
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      age: { type: Type.STRING },
      role: { type: Type.STRING },
    },
    required: ["id"],
  },
};

// --- Service Implementation ---

export class GoogleAIService implements AIService {
  async segmentDrawing(base64Image: string): Promise<Character[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Image.split(",")[1] || base64Image,
                },
              },
              {
                text: "Identify all characters. Return JSON array with 'id', 'description', and 'box_2d' [ymin, xmin, ymax, xmax].",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
                box_2d: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                  minItems: 4,
                  maxItems: 4,
                },
              },
              required: ["id", "description", "box_2d"],
            },
          },
        },
      });

      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Vision analysis failed", e);
      return [];
    }
  }

  async generateStoryImage(prompt: string, referenceImage?: string): Promise<string | null> {
    try {
      const parts: any[] = [{
        text: `INSTRUCTION: You are a child drawing. 
        TASK: Generate a new scene: "${prompt}".
        STYLE RULES: 
        1. Use the EXACT visual style of the reference image. 
        2. Characters MUST have identical faces, hair, and clothing colors as seen in the reference.
        3. If the reference is a rough sketch, keep it a rough sketch. Do not make it professional or 3D.
        4. Maintain the 'hand-drawn' feel, including paper texture and coloring style (crayon/marker).`
      }];

      if (referenceImage) {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: referenceImage.split(",")[1] || referenceImage,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ parts }],
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      const generatedPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return generatedPart ? `data:image/png;base64,${generatedPart.inlineData.data}` : null;
    } catch (e) {
      console.error("Image generation failed", e);
      return null;
    }
  }
}

export class GoogleChatService implements ChatService {
  private session: any;
  private callbacks: ChatCallbacks;

  constructor(callbacks: ChatCallbacks) {
    this.callbacks = callbacks;
  }

  async connect(systemInstruction: string) {
    // Using the 2.5/3 Flash Native Audio model for low-latency voice interaction
    this.session = await ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: systemInstruction + " Always use the generate_story_image tool when the child wants to see a new adventure. Remind yourself of the character's visual traits from the first drawing.",
        tools: [{ functionDeclarations: [highlightCharacterTool, generateStoryImageTool, updateCharacterInfoTool] }],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
        },
      },
      callbacks: {
        onmessage: async (message: LiveServerMessage) => {
          // Handle Audio
          if (message.serverContent?.modelTurn?.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              if (part.inlineData?.data) this.callbacks.onAudioChunk?.(part.inlineData.data);
            }
          }

          // Handle Tool Calls
          if (message.toolCall) {
            for (const call of message.toolCall.functionCalls) {
              let responseData = { success: true };
              
              if (call.name === "generate_story_image") {
                // Pass the combined prompt to the callback
                const fullPrompt = `${call.args.prompt}. Characters: ${call.args.characterDetails || ''}`;
                this.callbacks.onGenerateImage?.(fullPrompt);
              } else if (call.name === "highlight_character") {
                this.callbacks.onHighlightCharacter?.(call.args.id as string);
              } else if (call.name === "update_character_info") {
                const { id, name, age, role } = call.args as any;
                this.callbacks.onUpdateCharacterInfo?.(id, { name, age, role });
              }

              this.session.sendToolResponse({
                functionResponses: [{ name: call.name, id: call.id, response: responseData }]
              });
            }
          }
        },
      },
    });
  }

  sendAudio(base64Audio: string) {
    this.session?.sendRealtimeInput({ media: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } });
  }

  sendImage(base64Image: string) {
    this.session?.sendRealtimeInput({ media: { data: base64Image.split(",")[1] || base64Image, mimeType: 'image/jpeg' } });
  }

  close() {
    this.session?.close();
  }
}