import Image from "next/image";
import { useEffect, useState } from "react";
import * as io from "Socket.IO-client";
import { ChangeInputRequest } from "../types/ChangeInputRequest";

export default function Home() {
  // connected flag
  const [connected, setConnected] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    const socket = io.connect("http://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      console.log("connected");
      setConnected(true);
    });

    socket.on("toggle-image", (msg: ChangeInputRequest) => {
      console.log(msg.imageName);
      setImg(msg.imageName);
    });
  };

  return (
    <>
      <div>
        {connected ? (
          <div className={"imageContainer"}>
            {img !== "" ? (
              <Image alt="served_image" src={`/${img}`} sizes="100%" fill />
            ) : (
              <span>waiting for an image</span>
            )}
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
