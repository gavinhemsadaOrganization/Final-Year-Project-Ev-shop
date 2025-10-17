import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

// Use memory storage to handle files as buffers in memory.
// This is useful for processing files before saving them to disk or another storage service.
const storage = multer.memoryStorage();

/**
 * Multer middleware instance configured for handling specific document file types.
 * It uses memory storage and a file filter to allow only certain MIME types.
 */
export const upload = multer({
  storage,
  /**
   * A filter function to control which files are accepted.
   * This filter specifically allows common document types like PDF, Word, ZIP, and text files.
   */
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "text/plain",
    ];

    // Check if the file's MIME type is in the allowed list.
    if (allowed.includes(file.mimetype)) {
      // Accept the file.
      cb(null, true);
    } else {
      // Reject the file with an error.
      cb(new Error("Only PDFs, Word, ZIP, and text files are allowed!"));
    }
  },
});

/**
 * Saves a single file from a multer upload to a specified folder within the 'uploads' directory.
 * It ensures the target directory exists and gives the file a unique name to prevent collisions.
 *
 * @param file - The file object from `req.file`, provided by multer.
 * @param folderName - The name of the sub-directory within 'uploads' to save the file to.
 * @returns The relative path to the saved file from the project root.
 * @throws Will throw an error if the file write operation fails.
 */
export const addFile = (
  file: Express.Multer.File,
  folderName: string
): string => {
  try {
    // Construct the full path to the upload directory.
    const uploadDir = path.join(process.cwd(), "uploads", folderName);
    // If the directory doesn't exist, create it recursively.
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a unique file name using UUID to avoid overwriting files.
    const fileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, fileName);

    // Write the file buffer to the disk.
    fs.writeFileSync(fullPath, file.buffer);

    // Always return project-root-relative path
    return `uploads/${folderName}/${fileName}`.replace(/\\/g, "/");
  } catch (err) {
    console.error("File upload error:", err);
    throw new Error("File upload failed");
  }
};

/**
 * Deletes a single file from the filesystem based on its relative path.
 * Includes safety checks to prevent path traversal attacks.
 *
 * @param relativePath - The relative path to the file from the project root (e.g., 'uploads/folder/file.pdf').
 * @returns `true` if the file was successfully deleted, `false` otherwise.
 */
export const deleteFile = (relativePath: string): boolean => {
  try {
    // Sanitize the path to prevent directory traversal attacks (e.g., '../../etc/passwd').
    const safePath = relativePath
      .replace(/^(\.\.[/\\])+/, "")
      .replace(/^\/+/, "");
    // Construct the full, absolute path to the file.
    const fullPath = path.join(process.cwd(), safePath);

    console.log("Trying to delete:", { relativePath, safePath, fullPath });

    // Check if the file exists before attempting to delete it.
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    } else {
      console.warn("File not found for deletion:", fullPath);
    }
    // Return false if the file did not exist.
    return false;
  } catch (err: any) {
    console.error("Failed to delete file:", err.code, err.message);
    return false;
  }
};

/**
 * Saves multiple files from a multer upload to a specified folder.
 * This iterates over an array of files and saves each one with a unique name.
 *
 * @param files - An array of file objects from `req.files`, provided by multer.
 * @param folderName - The name of the sub-directory within 'uploads' to save the files to.
 * @returns An array of the relative paths to the saved files.
 * @throws Will throw an error if any file write operation fails.
 */
export const addFiles = (
  files: Express.Multer.File[],
  folderName: string
): string[] => {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePaths: string[] = [];

  // Loop through each file provided by multer.
  for (const file of files) {
    // Generate a unique file name for each file.
    const uniqueFileName = `${uuid()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, uniqueFileName);

    // Write the file to the disk.
    fs.writeFileSync(fullPath, file.buffer);

    // Store the relative path and normalize slashes for consistency.
    filePaths.push(
      `uploads/${folderName}/${uniqueFileName}`.replace(/\\/g, "/")
    );
  }

  return filePaths;
};

/**
 * Deletes multiple files from the filesystem.
 *
 * @param relativePaths - An array of relative paths to the files to be deleted.
 * @returns An array of booleans, where each boolean corresponds to the success of the deletion for each path.
 */
export const deleteFiles = (relativePaths: string[]): boolean[] => {
  return relativePaths.map((relPath) => deleteFile(relPath));
};
