import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "text/plain",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs, Word, ZIP, and text files are allowed!"));
    }
  },
});

// -------------------
// Single file handler
// -------------------
export const addFile = (
  file: Express.Multer.File,
  folderName: string
): string => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, file.buffer);

    // Always return project-root-relative path
    return `uploads/${folderName}/${fileName}`.replace(/\\/g, "/");
  } catch (err) {
    console.error("File upload error:", err);
    throw new Error("File upload failed");
  }
};

// -------------------
// Delete single file
// -------------------
export const deleteFile = (relativePath: string): boolean => {
  try {
    const safePath = relativePath.replace(/^(\.\.[/\\])+/, "").replace(/^\/+/, "");
    const fullPath = path.join(process.cwd(), safePath);

    console.log("Trying to delete:", { relativePath, safePath, fullPath });

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    } else {
      console.warn("File not found for deletion:", fullPath);
    }
    return false;
  } catch (err: any) {
    console.error("Failed to delete file:", err.code, err.message);
    return false;
  }
};


// ---------------------
// Multiple file handler
// ---------------------
export const addFiles = (
  files: Express.Multer.File[],
  folderName: string
): string[] => {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePaths: string[] = [];

  for (const file of files) {
    const uniqueFileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(fullPath, file.buffer);

    filePaths.push(`uploads/${folderName}/${uniqueFileName}`.replace(/\\/g, "/"));
  }

  return filePaths;
};

export const deleteFiles = (relativePaths: string[]): boolean[] => {
  return relativePaths.map((relPath) => deleteFile(relPath));
};
