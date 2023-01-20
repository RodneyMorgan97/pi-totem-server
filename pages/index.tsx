import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import * as io from "Socket.IO-client";

interface IMsg {
  imageName: string;
}

export default function Home() {
  // connected flag
  const [connected, setConnected] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    const socket = io.connect("http://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      console.log("connected");
      setConnected(true);
    });

    socket.on("update-input", (msg: IMsg) => {
      setImg(msg.imageName);
    });
  };

  return (
    <>
      <div>
        {connected ? (
          <div>
            <span>connected!</span>
          </div>
        ) : (
          <div>
            <span>connecting...</span>
          </div>
        )}
      </div>
    </>
  );
}
