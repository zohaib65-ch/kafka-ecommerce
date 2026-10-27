'use client';

import { useEffect, useRef } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';

import type { SupportMessage } from './types';

type MessageListProps = {
  messages: SupportMessage[];
  /** Id of the signed in user, to tell sent messages from received ones. */
  myId?: string;
};

export function MessageList({ messages, myId }: MessageListProps) {
  const container = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    const element = container.current;
    if (element)
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center p-6'>
        <EmptyState
          message='No messages found.'
          description='Say hello to start the conversation.'
          className='border-0'
        />
      </div>
    );
  }

  return (
    <div
      ref={container}
      role='log'
      aria-live='polite'
      aria-label='Messages'
      className='flex-1 space-y-1 overflow-y-auto p-4 sm:p-6'
    >
      {messages.map((message, index) => {
        const isMe = message.from === myId;
        // Consecutive messages from the same person are grouped under one header.
        const noHeader = index > 0 && messages[index - 1].from === message.from;

        return (
          <div
            key={message.id}
            className={cn(
              'flex flex-col',
              isMe ? 'items-end' : 'items-start',
              !noHeader && index > 0 && 'pt-4'
            )}
          >
            {!noHeader && (
              <p className='meta mb-1 flex items-center gap-2'>
                {!isMe && (
                  <span className='text-foreground'>{message.user?.name}</span>
                )}
                <time dateTime={new Date(message.time).toISOString()}>
                  {formatTime(message.time)}
                </time>
              </p>
            )}
            <p
              className={cn(
                'max-w-[85%] px-3.5 py-2 leading-relaxed break-words whitespace-pre-wrap sm:max-w-[75%]',
                isMe
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {message.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
