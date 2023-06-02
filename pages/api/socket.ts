// socket.ts
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import NextCors from "nextjs-cors";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!res.socket.server.io) {
    console.log("* New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("* A user connected");

      socket.on("toggle-image", (data) => {
        console.log(
          `* Received toggle-image event with data: ${JSON.stringify(data)}`
        );
        // Broadcast the event to other clients
        io.emit("toggle-image", data);
      });

      socket.on("disconnect", () => {
        console.log("* A user disconnected");
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default handler;
