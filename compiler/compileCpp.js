// import os from "os";
// import fs from "fs";
// import { exec } from "child_process";
// import path from "path";
// import { fileURLToPath } from "url";

// // ESM __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const compileCpp = async (code, callback) => {
//   const tempDir = path.join(__dirname, `temp_${Date.now()}`);
//   fs.mkdirSync(tempDir);

//   const sourceFile = path.join(tempDir, "main.cpp");
//   // const outputFile = path.join(tempDir, "main.exe"||"main"); // for Windows, use "main" for Linux/Mac
//   const outputFile = path.join(
//     tempDir,
//     os.platform() === "win32" ? "main.exe" : "main"
//   );
//   // Save C++ code
//   fs.writeFileSync(sourceFile, code);

//   // Compile & Run
//   exec(
//     `g++ "${sourceFile}" -o "${outputFile}" && "${outputFile}"`,
//     (err, stdout, stderr) => {
//       try {
//         // Delete files after execution
//         if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
//         fs.unlinkSync(sourceFile);
//         fs.rmdirSync(tempDir);
//       } catch (cleanupErr) {
//         console.error("Cleanup failed:", cleanupErr);
//       }

//       if (err) {
//         return callback(`Compilation/Runtime Error:\n${stderr}`);
//       }
//       callback(stdout);
//     }
//   );
// };

// export { compileCpp };

import os from "os";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compileCpp = async (code, callback) => {
  const tempDir = path.join(__dirname, `temp_${Date.now()}`);
  fs.mkdirSync(tempDir);

  const sourceFile = path.join(tempDir, "main.cpp");
  const outputFile = path.join(
    tempDir,
    os.platform() === "win32" ? "main.exe" : "main"
  );

  // Save C++ code
  fs.writeFileSync(sourceFile, code);

  // Determine the correct execution command
  const runCommand =
    os.platform() === "win32"
      ? `"${outputFile}"`
      : `cd "${tempDir}" && ./main`;

  // Compile & Run
  exec(`g++ "${sourceFile}" -o "${outputFile}" && ${runCommand}`, (err, stdout, stderr) => {
    try {
      // Cleanup files after execution
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
      fs.unlinkSync(sourceFile);
      fs.rmdirSync(tempDir);
    } catch (cleanupErr) {
      console.error("Cleanup failed:", cleanupErr);
    }

    if (err) {
      return callback(`Compilation/Runtime Error:\n${stderr}`);
    }
    callback(stdout);
  });
};

export { compileCpp };


