import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import NextCors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  if (req.method === "POST") {
    const { filename } = req.body;
    const filePath = path.resolve("public/images", filename);
    try {
      await fs.unlink(filePath);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete file" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
