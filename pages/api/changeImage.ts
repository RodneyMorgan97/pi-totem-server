import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { ChangeInputRequest } from "../../types/ChangeInputRequest";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    // get message
    const message = req.body as ChangeInputRequest;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("toggle-image", message);

    // return message
    res.status(201).json(message);
  }
};

export default handler;
