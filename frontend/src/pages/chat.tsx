import React, { useEffect } from 'react';
import ChatContainer from '@/components/Chat/ChatContainer';
import { modelStore } from '@/stores/ModelStore';

const ChatPage: React.FC = () => {
  useEffect(() => {
    // Ensure models are loaded when the page mounts
    const { models, fetchAllModels } = modelStore.getState();
    if (models.length === 0) {
      fetchAllModels().catch(console.error);
    }
  }, []);

  return (
    <div className="h-screen w-full bg-gray-50">
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
