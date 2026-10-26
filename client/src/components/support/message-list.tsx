'use client';

import { useEffect, useRef } from 'react';
import { MessagesSquare } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { formatTime } from '@/lib/format';
import { cn, getAvatarColor } from '@/lib/utils';

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
          icon={MessagesSquare}
          message='No messages found.'
          description='Say hello to start the conversation.'
          className='border-0 bg-transparent'
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
              'flex gap-2',
              isMe ? 'justify-end' : 'justify-start',
              !noHeader && index > 0 && 'pt-3'
            )}
          >
            {!isMe && (
              <div className='w-8 shrink-0'>
                {!noHeader && (
                  <span
                    aria-hidden='true'
                    className='grid size-8 place-items-center rounded-full text-xs font-semibold text-white'
                    style={{ backgroundColor: getAvatarColor(message.from) }}
                  >
                    {message.user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}
            <div
              className={cn(
                'flex max-w-[80%] flex-col',
                isMe ? 'items-end' : 'items-start'
              )}
            >
              {!noHeader && (
                <p className='mb-1 flex items-center gap-2 text-xs text-muted-foreground'>
                  {!isMe && (
                    <span className='font-medium text-foreground'>
                      {message.user?.name}
                    </span>
                  )}
                  <time dateTime={new Date(message.time).toISOString()}>
                    {formatTime(message.time)}
                  </time>
                </p>
              )}
              <p
                className={cn(
                  'rounded-2xl px-4 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
                  isMe
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md bg-muted'
                )}
              >
                {message.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
