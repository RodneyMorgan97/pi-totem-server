import formidable, { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import NextCors from "nextjs-cors";

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeFilename(filename: string) {
  return filename.replace(/[\/\\?%*:|"<>]/g, "-");
}

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "POST") {
    const form = new IncomingForm();
    const dir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let oldPath: string;
    let newPath: string;

    form.on("file", function (name, file: formidable.File) {
      console.log(file);
      console.log(name);
      if (name) {
        const fileName = sanitizeFilename(name);
        oldPath = file.filepath;
        console.log("oldpath = ", oldPath);

        console.log("the filename for the incoming file is: ", fileName);

        newPath = path.join(
          process.cwd(),
          "public",
          "images",
          sanitizeFilename(name)
        );
        console.log("newPath = ", newPath);
        if (fs.existsSync(newPath)) {
          res
            .status(409)
            .json({ error: "A file with this name already exists" });
          return;
        }

        console.log("Old Path: ", oldPath);
        console.log("New Path: ", newPath);
      } else {
        console.error("Original file name not provided");
      }
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }

      try {
        await fs.promises.rename(oldPath, newPath);
        console.log("File renamed and moved successfully");
        res.status(200).json({ message: "Upload successful" });
      } catch (renameErr) {
        console.error("Error renaming file: ", renameErr);
        res.status(500).json({ error: "Failed to rename and move file" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default uploadHandler;
