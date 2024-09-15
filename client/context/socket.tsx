"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Socket, io } from "socket.io-client";

export type SocketContextType = {
  socket: Socket | null;
};

type ContextProviderProps = {
  children: ReactNode;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketContextProvider: FC<ContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const server = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    setSocket(server);
    return () => {
      server.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Disconnection event
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      if (reason === "io server disconnect") {
        console.log(reason)
      } else if (reason === "ping timeout") {
        console.log(reason)
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    // Reconnect attempt
    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting attempt: ${attempt}`);
    });

    // Reconnect failed
    socket.on("reconnect_failed", () => {
      console.error("Reconnection failed. Giving up.");
    });

    // Reconnection success
    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected successfully on attempt: ${attempt}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
      socket.off("reconnect_failed");
      socket.off("reconnect");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocketContext = () => useContext(SocketContext);
