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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    const server = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
      reconnectionAttempts: 5,  // Limit the number of reconnection attempts
      timeout: 10000,  // Connection timeout after 10 seconds
    });
    setSocket(server);

    // Clean up the socket on unmount
    return () => {
      server.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Connection established
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setError(null);  // Clear any previous errors
    });

    // Disconnection event
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      if (reason === "io server disconnect") {
        setError("Server disconnected the connection.");
      } else if (reason === "ping timeout") {
        setError("Connection timed out. Trying to reconnect...");
      }
    });

    // Error handling
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      setError(`Connection error: ${err.message}`);
    });

    // Reconnect attempt
    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnecting attempt: ${attempt}`);
      setError(`Reconnecting... Attempt #${attempt}`);
    });

    // Reconnect failed
    socket.on("reconnect_failed", () => {
      console.error("Reconnection failed. Giving up.");
      setError("Failed to reconnect to the server.");
    });

    // Reconnection success
    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected successfully on attempt: ${attempt}`);
      setError(null);  // Clear any errors after successful reconnection
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
      {error && <div className="error">{error}</div>}
      {children}
    </SocketContext.Provider>
  );
};
export const useSocketContext = () => useContext(SocketContext);
