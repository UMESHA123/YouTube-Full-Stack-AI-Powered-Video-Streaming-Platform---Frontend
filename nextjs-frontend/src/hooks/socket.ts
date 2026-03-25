import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  const socketUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SOCKET_URL || "http://localhost:8080";
  if (!socket) {
    socket = io(socketUrl, {
      query: { userId },
      transports: ["websocket"],
    });
  }
  return socket;
};
