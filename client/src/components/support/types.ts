/** A user in the support chat (what `server/socket/support.js` keeps in memory). */
export interface SupportUser {
  id: string;
  name: string;
  role?: string;
  isAdmin?: boolean;
  online?: boolean;
  socketId?: string;
}

/** A chat message as emitted by the server's `message` / `getMessages` events. */
export interface SupportMessage {
  id: string;
  value: string;
  /** Epoch milliseconds. */
  time: number;
  user: SupportUser;
  from: string;
  to?: string;
}
