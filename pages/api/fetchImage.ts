import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import NextCors from "nextjs-cors";

export default async function fetchImages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const page = req.query.page ? Number(req.query.page) : 0;

  try {
    const imageDir = path.join(process.cwd(), "public", "images");
    const files = fs.readdirSync(imageDir);

    if (page < 0 || page >= files.length) {
      res.status(400).json({ message: "Invalid page number" });
      return;
    }

    const file = files[page];
    const imagePath = path.join(imageDir, file);
    const buffer = await sharp(imagePath, { animated: true, pages: -1 })
      .resize(480, null)
      .toBuffer();
    const base64 = buffer.toString("base64");

    const imageData = { name: file, base64 };

    res.status(200).json(imageData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
