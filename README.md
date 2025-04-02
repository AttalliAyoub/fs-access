# fs-access

A Deno library that provides file system access checking functionality, similar to Node.js's `fs.access` and `fs.accessSync`. This library helps you check if files or directories are accessible with specific permissions (read, write, execute) or if they exist.

## Features

- Check file/directory existence
- Check read permissions
- Check write permissions
- Check execute permissions
- Both synchronous and asynchronous APIs
- Cross-platform support (Windows and Unix-like systems)
- TypeScript support with full type definitions

## Installation

```typescript
import { access, accessSync, AccessMode } from "jsr:@attalliayoub/fs-access";
```

## Usage

### Basic Usage

```typescript
import { access, accessSync, AccessMode } from "jsr:@attalliayoub/fs-access";

// Check if a file exists
try {
  accessSync("./example.txt");
  console.log("File exists!");
} catch (error) {
  console.error("File does not exist:", error.message);
}

// Check if a file is readable
try {
  accessSync("./example.txt", AccessMode.R_OK);
  console.log("File is readable!");
} catch (error) {
  console.error("Cannot read file:", error.message);
}

// Check if a file is writable
try {
  accessSync("./example.txt", AccessMode.W_OK);
  console.log("File is writable!");
} catch (error) {
  console.error("Cannot write to file:", error.message);
}

// Check if a file is executable
try {
  accessSync("./script.sh", AccessMode.X_OK);
  console.log("File is executable!");
} catch (error) {
  console.error("Cannot execute file:", error.message);
}
```

### Asynchronous Usage

```typescript
import { access, AccessMode } from "jsr:@attalliayoub/fs-access";

// Check file access asynchronously
try {
  await access("./example.txt", AccessMode.R_OK);
  console.log("File is readable!");
} catch (error) {
  console.error("Cannot read file:", error.message);
}
```

## API Reference

### AccessMode Enum

```typescript
enum AccessMode {
  /** Check for file existence only */
  F_OK = 0,
  /** Check for read permission */
  R_OK = 4,
  /** Check for write permission */
  W_OK = 2,
  /** Check for execute permission */
  X_OK = 1,
}
```

### Functions

#### accessSync(path: string, mode?: AccessMode): void

Synchronously check if a file or directory is accessible.

- `path`: Path to the file or directory to check
- `mode`: Optional mode to check for (defaults to existence check)
- Throws an error if the file is not accessible with the specified mode

#### access(path: string, mode?: AccessMode): Promise<void>

Asynchronously check if a file or directory is accessible.

- `path`: Path to the file or directory to check
- `mode`: Optional mode to check for (defaults to existence check)
- Returns a Promise that rejects if the file is not accessible with the specified mode

## Error Handling

The library throws errors in the following cases:

- `ENOENT`: When the file or directory does not exist
- `EACCES`: When the requested access mode is not granted

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 