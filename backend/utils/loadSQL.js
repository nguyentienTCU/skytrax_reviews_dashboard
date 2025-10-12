import fs from "fs";
import path from "path";

export function loadSQL(filePath) {
    return fs.readFileSync(path.resolve(filePath), "utf-8");
}


