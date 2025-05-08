'use client';

import ChatPage from '../../pages/ChatPage'

export default function Chat({ params }: { params: { id: string } }) {
  return <ChatPage chatId={params.id} />
} 