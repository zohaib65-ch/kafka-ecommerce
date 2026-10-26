'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { io, type Socket } from 'socket.io-client';

import { getSocketUrl } from '@/lib/constants';
import { getStoredToken } from '@/lib/token';

type SocketContextValue = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = useCallback(() => {
    const token = getStoredToken();
    if (!token) return;

    const next = io(getSocketUrl(), { autoConnect: false });
    next.auth = { token };
    next.connect();
    setSocket(next);
  }, []);

  const disconnect = useCallback(() => {
    setSocket(current => {
      current?.close();
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({ socket, connect, disconnect }),
    [socket, connect, disconnect]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket must be used inside <SocketProvider>');
  return context;
}
