import { isExecutable, isExecutableSync } from "./is_executable.ts";
import { AccessMode, AccessMode2String } from "./types.ts";
export { AccessMode } from "./types.ts";

/**
 * Check if a file or directory is accessible in Deno
 * Similar to Node.js fs.accessSync but using Deno native APIs
 *
 * @param path: string | URL - Path to the file or directory to check
 * @param mode?: AccessMode - Optional mode to check for (defaults to existence check)
 *        fs.constants.F_OK - Check for existence (default)
 *        fs.constants.R_OK - Check for read permission
 *        fs.constants.W_OK - Check for write permission
 *        fs.constants.X_OK - Check for execute permission
 * @returns void - throws error if file is not accessible with specified mode
 * Example:
 * ```ts
 * // Try to access a file that exists
 * try {
 *   accessSync("./example.txt");
 *   console.log("File exists!");
 * } catch (error) {
 *   console.error("File does not exist:", error);
 * }
 *
 * // Check if file is readable
 * try {
 *   accessSync("./example.txt", 4); // Similar to fs.constants.R_OK
 *   console.log("File is readable!");
 * } catch (error) {
 *   console.error("Cannot read file:", error);
 * }
 *
 * // Check if file is writable
 * try {
 *   accessSync("./example.txt", AccessMode.W_OK); // Similar to fs.constants.W_OK
 *   console.log("File is writable!");
 * } catch (error) {
 *   console.error("Cannot write to file:", error);
 * }
 * ```
 */
export function accessSync(path: string | URL, mode?: AccessMode): void {
  try {
    const fileInfo = Deno.statSync(path);
    if (mode === null || mode === undefined) return;
    const { isFile, isDirectory } = fileInfo;
    switch (mode) {
      case AccessMode.R_OK:
        if (isFile) {
          const file = Deno.openSync(path, { read: true });
          file.close();
        } else if (isDirectory) {
          Deno.readDirSync(path).next();
        }
        break;
      case AccessMode.W_OK:
        if (isFile) {
          const file = Deno.openSync(path, { write: true });
          file.close();
        } else if (isDirectory) {
          const tempPath = `${path}/.deno_access_test_${Date.now()}`;
          Deno.writeTextFileSync(tempPath, "");
          Deno.removeSync(tempPath);
        }
        break;
      case AccessMode.X_OK:
        if (isDirectory) {
          Deno.readDirSync(path).next();
        } else if (isFile) {
          const isExecutable = isExecutableSync(path);
          if (!isExecutable) {
            throw new Error(`EACCES: permission denied, execute '${path}'`);
          }
        }
        break;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`ENOENT: no such file or directory, access '${path}'`, {
        cause: error,
      });
    }
    throw new Error(
      `EACCES: permission denied, ${AccessMode2String(mode)} '${path}'`,
      { cause: error },
    );
  }
}

/**
 * Check if a file or directory is accessible in Deno
 * Similar to Node.js fs.access but using Deno native APIs
 *
 * @param path: string | URL - Path to the file or directory to check
 * @param mode?: AccessMode - Optional mode to check for (defaults to existence check)
 * @returns Promise<void> - throws error if file is not accessible with specified mode
 * Example:
 * ```ts
 * await access("./example.txt");
 * console.log("File exists!");
 * ```
 */
export async function access(path: string | URL, mode?: AccessMode): Promise<void> {
  try {
    const fileInfo = await Deno.stat(path);
    if (mode === null || mode === undefined) return;
    const { isFile, isDirectory } = fileInfo;
    switch (mode) {
      case AccessMode.R_OK:
        if (isFile) {
          await Deno.open(path, { read: true })
            .then((file) => file.close());
        } else if (isDirectory) {
          await Deno.readDir(path)[Symbol.asyncIterator]().next();
        }
        break;
      case AccessMode.W_OK:
        if (isFile) {
          await Deno.open(path, { write: true })
            .then((file) => file.close());
        } else if (isDirectory) {
          const tempPath = `${path}/.deno_access_test_${Date.now()}`;
          await Deno.writeTextFile(tempPath, "")
            .then(() => Deno.remove(tempPath));
        }
        break;
      case AccessMode.X_OK:
        if (isDirectory) {
          await Deno.readDir(path)[Symbol.asyncIterator]().next();
        } else if (isFile) {
          const executable = await isExecutable(path);
          if (!executable) {
            throw new Error(`EACCES: permission denied, execute '${path}'`);
          }
        }
        break;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`ENOENT: no such file or directory, access '${path}'`, {
        cause: error,
      });
    }
    throw new Error(
      `EACCES: permission denied, ${AccessMode2String(mode)} '${path}'`,
      { cause: error },
    );
  }
}