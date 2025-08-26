import { spawn } from "child_process";
import fs from "fs";

export const Runcode = (language, code, stdin = "") => {
  return new Promise((resolve, reject) => {
    let file, compileCmd, runCmd, runArgs;

    if (language === "cpp") {
      file = "temp.cpp";
      fs.writeFileSync(file, code);
      compileCmd = spawn("g++", [file, "-o", "temp.exe"]);
      compileCmd.on("close", (code) => {
        if (code !== 0) return reject("Compilation failed");

        const runProcess = spawn("temp.exe");
        let output = "", error = "";

        runProcess.stdout.on("data", (data) => output += data.toString());
        runProcess.stderr.on("data", (data) => error += data.toString());
        runProcess.on("close", () => error ? reject(error) : resolve(output));

        runProcess.stdin.write(stdin);
        runProcess.stdin.end();
      });
    }
    else if (language === "python") {
      file = "temp.py";
      fs.writeFileSync(file, code);
      const runProcess = spawn("python", [file]);
      let output = "", error = "";

      runProcess.stdout.on("data", (data) => output += data.toString());
      runProcess.stderr.on("data", (data) => error += data.toString());
      runProcess.on("close", () => error ? reject(error) : resolve(output));

      runProcess.stdin.write(stdin);
      runProcess.stdin.end();
    }
    else if (language === "javascript") {
      file = "temp.js";
      fs.writeFileSync(file, code);
      const runProcess = spawn("node", [file]);
      let output = "", error = "";

      runProcess.stdout.on("data", (data) => output += data.toString());
      runProcess.stderr.on("data", (data) => error += data.toString());
      runProcess.on("close", () => error ? reject(error) : resolve(output));

      runProcess.stdin.write(stdin);
      runProcess.stdin.end();
    }
    else {
      reject(new Error("Unsupported language"));
    }
  });
};
