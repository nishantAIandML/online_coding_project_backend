import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compilePython = async (code, callback) => {
  const tempDir = path.join(__dirname, `temp_${Date.now()}`);
  fs.mkdirSync(tempDir);

  const filename = path.join(tempDir, "main.py");

  // Save Python code
  fs.writeFileSync(filename, code);

  // Run Python
  exec(`python "${filename}"`, (err, stdout, stderr) => {
    // Always clean up, even if error occurs
    try {
      fs.unlinkSync(filename); // delete file
      fs.rmdirSync(tempDir); // delete folder
    } catch (cleanupErr) {
      console.error("Cleanup failed:", cleanupErr);
    }

    if (err) {
      return callback(`Runtime Error:\n${stderr}`);
    }
    callback(stdout);
  });
};

export { compilePython };
