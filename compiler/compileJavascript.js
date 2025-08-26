import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compileJavaScript = async (code, callback) => {
  const tempDir = path.join(__dirname, `temp_${Date.now()}`);
  fs.mkdirSync(tempDir);

  const filename = path.join(tempDir, "main.js");

  // Save JS code
  fs.writeFileSync(filename, code);

  // Run Node.js
  exec(`node "${filename}"`, (err, stdout, stderr) => {
    try {
      fs.unlinkSync(filename);
      fs.rmdirSync(tempDir);
    } catch (cleanupErr) {
      console.error("Cleanup failed:", cleanupErr);
    }

    if (err) {
      return callback(`Runtime Error:\n${stderr}`);
    }
    callback(stdout);
  });
};

export { compileJavaScript };
