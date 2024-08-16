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

export type SocketContext = {
  socket: Socket | null;
};

type ContextProviderProps = {
  children: ReactNode;
};

const SocketContext = createContext<SocketContext>({
  socket: null,
});

export const SocketContextProvider: FC<ContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const server = io("http://localhost:3001");
    setSocket(server);

    return () => {
      server.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
