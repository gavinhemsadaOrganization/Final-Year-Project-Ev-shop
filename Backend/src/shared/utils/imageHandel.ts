import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

// Use memory storage to handle files as buffers in memory.
// This is useful for processing files (e.g., resizing, watermarking) before saving them.
const storage = multer.memoryStorage();

/**
 * Multer middleware instance configured specifically for handling image file uploads.
 * It uses memory storage and a file filter to allow only JPEG and PNG images.
 */
export const upload = multer({
  storage,
  /**
   * A filter function to control which files are accepted.
   */
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png and .jpg files are allowed!"));
    }
  },
});

/**
 * Saves a single image file from a multer upload to a specified folder within the 'uploads' directory.
 * It ensures the target directory exists and gives the file a unique name to prevent collisions.
 *
 * @param file - The file object from `req.file`, provided by multer.
 * @param folderName - The name of the sub-directory within 'uploads' to save the image to.
 * @returns The relative path to the saved image or an error message string on failure.
 */
export const addImage = (
  file: Express.Multer.File,
  folderName: string
): string => {
  try {
    // Construct the full path to the upload directory.
    const uploadDir = path.join(process.cwd(), "uploads", folderName);
    // If the directory doesn't exist, create it recursively.
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

/**
 * Deletes a single image file from the filesystem based on its relative path.
 *
 * @param relativePath - The relative path to the image from the project root (e.g., 'uploads/folder/image.jpg').
 * @returns `true` if the file was successfully deleted, `false` otherwise.
 */
export const deleteImage = (relativePath: string): boolean => {
  try {
    // Construct the full, absolute path to the file.
    const fullPath = path.join(process.cwd(), relativePath);
    // Check if the file exists before attempting to delete it.
    if (fs.existsSync(fullPath)) {
      // Synchronously delete the file.
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to delete image:", err);
    return false;
  }
};

/**
 * Extracts the original file name from a path that was created using the UUID prefix.
 *
 * @param imagePath - The full path or relative path to the image.
 * @returns The original file name, without the UUID and hyphen prefix.
 */
export const getOriginalFileName = (imagePath: string): string => {
  const fileName = path.basename(imagePath);
  const index = fileName.lastIndexOf("-");
  return index !== -1 ? fileName.substring(index + 1) : fileName;
};

/**
 * Saves multiple image files from a multer upload to a specified folder.
 * This iterates over an array of files and saves each one with a unique name.
 *
 * @param files - An array of file objects from `req.files`, provided by multer.
 * @param folderName - The name of the sub-directory within 'uploads' to save the images to.
 * @returns An array of the relative paths to the saved images.
 * @throws Will throw an error if any file write operation fails.
 */
export const addImages = (
  files: Express.Multer.File[],
  folderName: string
): string[] => {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePaths: string[] = [];

  // Loop through each file provided by multer.
  for (const file of files) {
    const uniqueFileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(fullPath, file.buffer);

    // store relative path
    filePaths.push(
      path.join("uploads", folderName, uniqueFileName).replace(/\\/g, "/")
    );
  }

  return filePaths;
};

/**
 * Deletes multiple image files from the filesystem.
 *
 * @param relativePaths - An array of relative paths to the images to be deleted.
 * @returns An array of booleans, where each boolean corresponds to the success of the deletion for each path.
 */
export const deleteImages = (relativePaths: string[]): boolean[] => {
  return relativePaths.map((relPath) => deleteImage(relPath));
};

/**
 * A helper function to extract just the file name from a full or relative path.
 *
 * @param filePath - The path to the file.
 * @returns The base name of the file (e.g., 'image.jpg').
 */
export const getFileName = (filePath: string): string => {
  return path.basename(filePath);
};

/**
 * A helper function to extract the name of the immediate parent folder from a file path.
 *
 * @param filePath - The path to the file.
 * @returns The name of the directory containing the file.
 */
export const getFolderName = (filePath: string): string => {
  return path.basename(path.dirname(filePath));
};
