import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8"));
const scratchDirectory = await mkdtemp(join(tmpdir(), "eliware-log-types-"));
const npmCli =
  process.env.npm_execpath ??
  resolve(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");

function run(command, args, cwd, { capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}.`);
  }

  return result.stdout;
}

function runNpm(args, cwd, options) {
  return run(process.execPath, [npmCli, ...args], cwd, options);
}

try {
  const packOutput = runNpm(
    ["pack", "--json", "--pack-destination", scratchDirectory],
    repositoryRoot,
    { capture: true },
  );
  const packReport = JSON.parse(packOutput);
  const packDetails = packReport[packageJson.name] ?? Object.values(packReport)[0];
  const tarballPath = join(scratchDirectory, packDetails.filename);
  const consumerDirectory = join(scratchDirectory, "consumer");
  await mkdir(consumerDirectory);
  await writeFile(
    join(consumerDirectory, "package.json"),
    JSON.stringify({ name: "strict-consumer", private: true, type: "module" }),
  );
  runNpm(
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarballPath,
      `typescript@${packageJson.devDependencies.typescript}`,
    ],
    consumerDirectory,
  );

  const fixture = await readFile(
    join(repositoryRoot, "test-fixtures", "public-api-consumer.mts"),
    "utf8",
  );
  await writeFile(join(consumerDirectory, "consumer.mts"), fixture);
  await writeFile(
    join(consumerDirectory, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2024",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          skipLibCheck: false,
          noEmit: true,
        },
        files: ["consumer.mts"],
      },
      null,
      2,
    )}\n`,
  );

  const compilerPath = join(consumerDirectory, "node_modules", "typescript", "bin", "tsc");
  run(
    process.execPath,
    [compilerPath, "--project", join(consumerDirectory, "tsconfig.json")],
    consumerDirectory,
  );

  const installedPackage = JSON.parse(
    await readFile(
      join(consumerDirectory, "node_modules", "@eliware", "log", "package.json"),
      "utf8",
    ),
  );
  if (installedPackage.version !== packageJson.version) {
    throw new Error(
      `Expected @eliware/log@${packageJson.version}, received @eliware/log@${installedPackage.version}.`,
    );
  }

  process.stdout.write(
    `Strict TypeScript consumer passed for @eliware/log@${installedPackage.version}.\n`,
  );
} finally {
  await rm(scratchDirectory, { recursive: true, force: true });
}
