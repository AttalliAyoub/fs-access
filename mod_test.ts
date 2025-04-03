import { access, AccessMode, accessSync } from "./mod.ts";

Deno.test(async function addTest(t) {
  await t.step('access - existence', async () => {
    await access('./README.md')
  })
  await t.step('accessSync - Read', () => {
    accessSync('./README.md', AccessMode.R_OK)
  })
  await t.step('access - Write', async () => {
    await access('./README.md', AccessMode.W_OK);
  })
  await t.step('accessSync - execute', () => {
    accessSync('./test.cmd', AccessMode.X_OK)
  })
});
