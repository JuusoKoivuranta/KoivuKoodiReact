// Common interfaces and types for the server

export type MoveData = {
  from: string;
  to: string;
  piece: unknown;  // Server doesn't inspect piece structure, just passes it through
  moveNotation?: string;
}

export type ChatMessage = {
  nickname: string;
  message: string;
  color: string;
}
