'use client';

import React from 'react';
import ChatPage from '../../pages/ChatPage'

interface ChatParams {
  id: string;
}

export default function Chat({ params }: { params: Promise<ChatParams> }) {
  const resolvedParams = React.use(params);
  console.log('Chat page params:', resolvedParams);
  return <ChatPage chatId={resolvedParams.id} />
} 