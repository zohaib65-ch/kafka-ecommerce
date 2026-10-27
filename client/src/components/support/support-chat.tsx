'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

import { MessageComposer } from './message-composer';
import { MessageList } from './message-list';
import type { SupportMessage, SupportUser } from './types';
import { UserList } from './user-list';

// Same key as before the migration, so a remembered chat survives the upgrade.
const SELECTED_CHAT_KEY = 'selected_suport_chat';

const readSelectedChat = () => {
  try {
    return window.localStorage.getItem(SELECTED_CHAT_KEY);
  } catch {
    return null;
  }
};

const mergeMessages = (
  current: SupportMessage[],
  incoming: SupportMessage[]
) => {
  const known = new Set(current.map(message => message.id));
  const added = incoming.filter(message => !known.has(message.id));
  return added.length > 0 ? [...current, ...added] : current;
};

/**
 * Real-time support chat over Socket.IO (events: connectUser, getUsers, getMessages, message,
 * disconnectUser). Admins see every user; everyone else sees the admins.
 */
export function SupportChat() {
  const { socket, connect, disconnect } = useSocket();
  const me = useAppSelector(state => state.account.user);
  const myId = me._id ?? me.id;

  const [users, setUsers] = useState<SupportUser[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [connected, setConnected] = useState(false);
  // Safe to read localStorage here: this component only mounts on the client, after the auth guard.
  const [selectedId, setSelectedId] = useState<string | null>(readSelectedChat);
  const [unread, setUnread] = useState<Record<string, number>>({});

  // Socket handlers outlive renders, so they read the latest ids through refs.
  const selectedIdRef = useRef(selectedId);
  const myIdRef = useRef(myId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
    myIdRef.current = myId;
  }, [selectedId, myId]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    const init = () => {
      setConnected(true);
      socket.emit('connectUser');
      socket.emit('getUsers');
      socket.emit('getMessages');
    };
    const onDisconnect = () => setConnected(false);
    const onUsers = (list: SupportUser[]) => setUsers(list);
    const onMessages = (list: SupportMessage[]) =>
      setMessages(current => mergeMessages(current, list));
    const onMessage = (message: SupportMessage) => {
      setMessages(current => mergeMessages(current, [message]));
      if (
        message.from !== myIdRef.current &&
        message.from !== selectedIdRef.current
      ) {
        setUnread(current => ({
          ...current,
          [message.from]: (current[message.from] ?? 0) + 1
        }));
      }
    };
    const onConnectUser = (user: SupportUser) =>
      setUsers(current =>
        current.some(item => item.id === user.id)
          ? current.map(item => (item.id === user.id ? user : item))
          : [...current, user]
      );
    const onDisconnectUser = (user: SupportUser) =>
      setUsers(current =>
        current.map(item => (item.id === user.id ? user : item))
      );

    socket.on('connect', init);
    socket.on('disconnect', onDisconnect);
    socket.on('getUsers', onUsers);
    socket.on('getMessages', onMessages);
    socket.on('message', onMessage);
    socket.on('connectUser', onConnectUser);
    socket.on('disconnectUser', onDisconnectUser);
    if (socket.connected) init();

    return () => {
      socket.off('connect', init);
      socket.off('disconnect', onDisconnect);
      socket.off('getUsers', onUsers);
      socket.off('getMessages', onMessages);
      socket.off('message', onMessage);
      socket.off('connectUser', onConnectUser);
      socket.off('disconnectUser', onDisconnectUser);
    };
  }, [socket]);

  const selectedUser = users.find(user => user.id === selectedId) ?? null;

  const activeChat = selectedUser
    ? messages
        .filter(
          message =>
            message.from === selectedUser.id || message.to === selectedUser.id
        )
        .sort((a, b) => a.time - b.time)
    : [];

  const selectUser = (user: SupportUser) => {
    setSelectedId(user.id);
    setUnread(current => ({ ...current, [user.id]: 0 }));
    try {
      window.localStorage.setItem(SELECTED_CHAT_KEY, user.id);
    } catch {
      // remembering the chat is optional
    }
  };

  const sendMessage = (text: string) => {
    if (!socket || !selectedUser) return;
    socket.emit('message', { text, to: selectedUser.id });
  };

  if (!socket) {
    return (
      <EmptyState
        message='Not connected.'
        description='Connecting to support…'
      />
    );
  }

  if (!connected && users.length === 0) {
    return (
      <PageLoader label='Connecting to support' className='min-h-[30vh]' />
    );
  }

  if (users.length === 0) {
    return <EmptyState message='No users connected.' />;
  }

  return (
    <div className='grid h-[calc(100dvh-22rem)] max-h-[46rem] min-h-[26rem] overflow-hidden border bg-card md:grid-cols-[18rem_minmax(0,1fr)]'>
      <aside
        aria-label='Conversations'
        className={cn(
          'min-h-0 overflow-y-auto border-b md:border-r md:border-b-0',
          selectedUser && 'hidden md:block'
        )}
      >
        <h2 className='meta border-b px-4 py-3 font-sans'>Conversations</h2>
        <UserList
          users={users}
          selectedId={selectedUser?.id ?? null}
          unread={unread}
          onSelect={selectUser}
        />
      </aside>

      <section
        aria-label='Chat'
        className={cn(
          'flex min-h-0 flex-col',
          !selectedUser && 'hidden md:flex'
        )}
      >
        {selectedUser ? (
          <>
            <header className='flex items-center gap-3 border-b px-4 py-3'>
              <Button
                variant='ghost'
                size='icon-sm'
                className='md:hidden'
                aria-label='Back to conversations'
                onClick={() => setSelectedId(null)}
              >
                <ArrowLeft />
              </Button>
              <div className='min-w-0'>
                <h3 className='truncate font-heading text-2xl leading-none font-semibold uppercase'>
                  {selectedUser.name}
                </h3>
                <p className='meta mt-1'>
                  {selectedUser.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </header>
            <MessageList messages={activeChat} myId={myId} />
            <MessageComposer disabled={!connected} onSend={sendMessage} />
          </>
        ) : (
          <div className='flex flex-1 items-center justify-center p-6'>
            <EmptyState
              message='Select chat to start messaging'
              className='border-0'
            />
          </div>
        )}
      </section>
    </div>
  );
}
