import { IncomingForm, Fields } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import NextCors from "nextjs-cors";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface File {
  size: number;
  path: string;
  name: string;
  type: string;
  lastModifiedDate?: Date;
  hash?: string;
  length?: number;
  filename?: string;
  mime?: string;
}

interface FormidableData {
  fields: Fields;
  files: {
    [name: string]: File;
  };
}

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  if (req.method === "POST") {
    const data: FormidableData = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err: any, fields: Fields, files: any) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files?.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const readStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(
      path.join(process.cwd(), "public", "images", file.name)
    );

    readStream.pipe(writeStream);

    readStream.on("end", () => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error: ", err);
      });
    });

    return res.status(200).json({ message: "Upload successful" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default uploadHandler;
