import Image from "next/image";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";
import { ChangeInputRequest } from "../types/ChangeInputRequest";
import { ChangeBackgroundRequest } from "../types/ChangeBackgroundRequest";

export default function Home() {
  // connected flag
  const [connected, setConnected] = useState(false);
  const [img, setImg] = useState("");
  const [background, setBackground] = useState("#FFFFFF");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    const socket = io.connect("http://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("toggle-image", (msg: ChangeInputRequest) => {
      setImg(msg.imageName);
    });

    socket.on("toggle-background", (msg: ChangeBackgroundRequest) => {
      console.log("received ", msg.color);
      setBackground(msg.color);
    });
  };

  return (
    <>
      {connected ? (
        <div>
          {img !== "" ? (
            <Image
              alt="served_image"
              src={`/images/${img}`}
              fill
              style={{ objectFit: "contain", backgroundColor: background }}
            />
          ) : (
            <span>waiting for an image</span>
          )}
        </div>
      ) : (
        <div>
          <span>connecting...</span>
        </div>
      )}
    </>
  );
}
