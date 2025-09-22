import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png and .jpg files are allowed!"));
    }
  },
});

//   ** single image handle **

export const addImage = (
  file: Express.Multer.File,
  folderName: string
): string => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, fileName);

    fs.writeFileSync(fullPath, file.buffer);

    // return relative path instead of full system path
    return path.join("uploads", folderName, fileName).replace(/\\/g, "/");
  } catch (err) {
    return `img upload error: ${err}`;
  }
};

export const deleteImage = (relativePath: string): boolean => {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to delete image:", err);
    return false;
  }
};

export const getOriginalFileName = (imagePath: string): string => {
  const fileName = path.basename(imagePath);
  const index = fileName.lastIndexOf("-");
  return index !== -1 ? fileName.substring(index + 1) : fileName;
};

//   ** multiple images handle **

export const addImages = (
  files: Express.Multer.File[],
  folderName: string
): string[] => {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePaths: string[] = [];

  for (const file of files) {
    const uniqueFileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(fullPath, file.buffer);

    // store relative path
    filePaths.push(path.join("uploads", folderName, uniqueFileName).replace(/\\/g, "/"));
  }

  return filePaths;
};

export const deleteImages = (relativePaths: string[]): boolean[] => {
  return relativePaths.map((relPath) => deleteImage(relPath));
};

// helpers to extract folder & file name

export const getFileName = (filePath: string): string => {
  return path.basename(filePath);
};

export const getFolderName = (filePath: string): string => {
  return path.basename(path.dirname(filePath));
};
