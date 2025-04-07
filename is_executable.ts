/**
 * Check if a file is executable in Deno
 *
 * @param path: string | URL - Path to the file to check
 * @returns Promise<boolean> - true if the file is executable, false otherwise
 *
 * Example:
 * ```ts
 * const isExecutable = await isExecutable("./my-script.sh");
 * console.log(isExecutable);
 * ```
 */
export async function isExecutable(path: string | URL): Promise<boolean> {
	const fileInfo = await Deno.stat(path);
	if (!fileInfo.isFile) return false;
	if (Deno.build.os === "windows") {
		const execExtensions = [".exe", ".cmd", ".bat", ".com"];
		return execExtensions.some((ext) =>
			path.toString().toLowerCase().endsWith(ext)
		);
	}
	const permissions = await Deno.permissions.query({
		name: "run",
		command: path,
	});
	if (permissions.state !== "granted") return false;
	const command = new Deno.Command("test", { args: ["-x", path.toString()] });
	const { code } = await command.output();
	return code === 0;
}

/**
 * Synchronous version of isExecutable
 *
 * @param path: string | URL - Path to the file to check
 * @returns boolean - true if the file is executable, false otherwise
 *
 * Example:
 * ```ts
 * const isExecutable = isExecutableSync("./my-script.sh");
 * console.log(isExecutable);
 * ```
 */
export function isExecutableSync(path: string | URL): boolean {
	const fileInfo = Deno.statSync(path);
	if (!fileInfo.isFile) return false;
	if (Deno.build.os === "windows") {
		const execExtensions = [".exe", ".cmd", ".bat", ".com"];
		return execExtensions.some((ext) =>
			path.toString().toLowerCase().endsWith(ext)
		);
	}
	const permissions = Deno.permissions.querySync({
		name: "run",
		command: path,
	});
	if (permissions.state !== "granted") return false;
	const command = new Deno.Command("test", { args: ["-x", path.toString()] });
	const { code } = command.outputSync();
	return code === 0;
}
