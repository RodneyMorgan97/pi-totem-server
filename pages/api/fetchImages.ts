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
    // Options
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const imageDir = path.join(process.cwd(), "public", "images");
    const files = fs.readdirSync(imageDir);

    const imagesData = await Promise.all(
      files.map(async (file) => {
        const imagePath = path.join(imageDir, file);

        // Compress and convert image to base64
        const buffer = await sharp(imagePath)
          .resize(480, null) // This will resize the width to 480 and automatically adjust the height to maintain the aspect ratio
          .toBuffer();
        const base64 = buffer.toString("base64");

        return { name: file, base64 };
      })
    );

    res.status(200).json(imagesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
