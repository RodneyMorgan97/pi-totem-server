// pages/api/getImageCount.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const directoryPath = path.join(process.cwd(), "public", "images");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).json({ count: 0 });
    } else {
      return res.status(200).json({ count: files.length });
    }
  });
}
