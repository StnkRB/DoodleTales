import { GoogleAIService, GoogleChatService } from "./google";
import { AIService, ChatService, ChatCallbacks } from "./types";

export * from "./types";

export function getAIService(): AIService {
  return new GoogleAIService();
}

export function createChatService(callbacks: ChatCallbacks): ChatService {
  return new GoogleChatService(callbacks);
}
