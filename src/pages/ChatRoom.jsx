import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ChatRoom() {
  useDocumentTitle('Chat Room | Delvin Julian');
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">Chat Room</h1>
      <p className="text-gray-600 dark:text-gray-400">Connect with me...</p>
    </div>
  );
}
