import { create } from "zustand";
import { Chat, ChatMessage } from "@/../../shared/interfaces/chat";
import { Prompt } from "@/../../shared/interfaces/prompt";
import { v4 as uuidv4 } from "uuid";
import { fetchFromPromptdesk } from "@/services/PromptdeskService";
import { modelStore } from "@/stores/ModelStore";
import { promptStore } from "@/stores/prompts";

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  isLoading: boolean;
  isInitialized: boolean;
  shouldFocus: boolean;
  
  // Actions
  initializeChat: () => Promise<void>;
  createNewChat: () => string;
  startNewChat: () => string;
  selectChat: (chatId: string) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => ChatMessage;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  sendMessage: (content: string) => Promise<void>;
  clearCurrentChat: () => void;
  setShouldFocus: (shouldFocus: boolean) => void;
}

const chatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChatId: null,
  currentChat: null,
  isLoading: false,
  isInitialized: false,
  shouldFocus: false,

  setShouldFocus: (shouldFocus: boolean) => {
    set({ shouldFocus });
  },

  initializeChat: async () => {
    try {
      // Ensure the model is loaded
      const modelStoreState = modelStore.getState();
      if (!modelStoreState.modelObject || !modelStoreState.modelObject.id) {
        // Try to load models if not already loaded
        if (modelStoreState.models.length === 0) {
          await modelStoreState.fetchAllModels();
        }
        
        // Find the specified model or use default
        const targetModel = modelStoreState.models.find(m => m.id === "6537ca59b4c4cdf186077431");
        const defaultModel = modelStoreState.models.find(m => m.default);
        const modelToUse = targetModel || defaultModel || modelStoreState.models[0];
        
        if (modelToUse) {
          modelStore.setState({ 
            selectedModel: modelToUse.id,
            modelObject: modelToUse 
          });
        }
      }
      
      set({ isInitialized: true });
    } catch (error) {
      console.error('Error initializing chat:', error);
      set({ isInitialized: true }); // Set to true anyway to avoid blocking
    }
  },

  createNewChat: () => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set(state => ({
      chats: [...state.chats, newChat],
      currentChatId: newChatId,
      currentChat: newChat,
      shouldFocus: true, // Trigger focus when new chat is created
    }));
    
    return newChatId;
  },

  startNewChat: () => {
    // Clear current chat and create a fresh one
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set(state => ({
      chats: [...state.chats, newChat],
      currentChatId: newChatId,
      currentChat: newChat,
      shouldFocus: true,
    }));
    
    return newChatId;
  },

  selectChat: (chatId: string) => {
    const chat = get().chats.find(c => c.id === chatId);
    if (chat) {
      set({
        currentChatId: chatId,
        currentChat: chat,
      });
    }
  },

  addMessage: (content: string, role: 'user' | 'assistant') => {
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
      isLoading: role === 'assistant',
    };

    set(state => {
      if (!state.currentChat) return state;
      
      const updatedChat = {
        ...state.currentChat,
        messages: [...state.currentChat.messages, message],
        updatedAt: new Date(),
        title: state.currentChat.messages.length === 0 
          ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
          : state.currentChat.title,
      };

      return {
        currentChat: updatedChat,
        chats: state.chats.map(chat => 
          chat.id === state.currentChatId ? updatedChat : chat
        ),
      };
    });

    return message;
  },

  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => {
    set(state => {
      if (!state.currentChat) return state;
      
      const updatedChat = {
        ...state.currentChat,
        messages: state.currentChat.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
        updatedAt: new Date(),
      };

      return {
        currentChat: updatedChat,
        chats: state.chats.map(chat => 
          chat.id === state.currentChatId ? updatedChat : chat
        ),
      };
    });
  },

  sendMessage: async (content: string) => {
    let state = get();
    
    // If no current chat, create one
    if (!state.currentChat) {
      state.createNewChat();
      state = get(); // Get updated state after creating chat
    }

    // Add user message
    const userMessage = state.addMessage(content, 'user');
    
    // Add assistant message placeholder
    const assistantMessage = state.addMessage('', 'assistant');
    
    set({ isLoading: true });

    try {
      // Get the updated state to ensure we have all messages
      const updatedState = get();
      
      // Get the current conversation including the new user message
      // but excluding the loading assistant message
      const currentMessages = updatedState.currentChat?.messages
        .filter(msg => msg.id !== assistantMessage.id && !msg.isLoading) // Exclude the loading assistant message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        })) || [];

      const prompt: Prompt = {
        id: uuidv4(),
        name: `Chat ${new Date().toLocaleString()}`,
        description: "Chat conversation",
        model: modelStore.getState().modelObject?.id, // Use selected model or fallback
        model_type: "chat",
        organization_id: "",
        project: undefined,
        provider: undefined,
        model_parameters: {},
        prompt_variables: {},
        new: true,
        prompt_data: {
          context: "You are a helpful assistant.",
          messages: currentMessages
        }
      };

      console.log('Sending chat request with messages:', currentMessages);
      console.log('Full prompt:', prompt);

      // Call the PromptDesk API
      const response = await fetchFromPromptdesk("/generate", "POST", prompt);
      
      console.log('Received response:', response);
      
      // Get the latest state for updating the message
      const finalState = get();
      
      // Update the assistant message with the response
      if (response && response.message) {
        const content = typeof response.message === 'string' 
          ? response.message 
          : response.message.content || JSON.stringify(response.message);
          
        finalState.updateMessage(assistantMessage.id, {
          content,
          isLoading: false,
        });
        
        // Trigger focus after response
        set({ shouldFocus: true });
      } else {
        finalState.updateMessage(assistantMessage.id, {
          content: 'Sorry, I received an empty response.',
          isLoading: false,
        });
        
        // Trigger focus after response
        set({ shouldFocus: true });
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorState = get();
      errorState.updateMessage(assistantMessage.id, {
        content: `Sorry, there was an error: ${error.message || 'Unknown error'}`,
        isLoading: false,
      });
      
      // Trigger focus after error
      set({ shouldFocus: true });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentChat: () => {
    set({
      currentChatId: null,
      currentChat: null,
    });
  },
}));

export { chatStore };
