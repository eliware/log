import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['node_modules/jest/bin/jest.js', '--detectOpenHandles', '--silent', '--coverage'], {
  encoding: 'utf8',
  env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --experimental-vm-modules --no-warnings` }
});
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');

if (result.status !== 0) process.exit(result.status ?? 1);

const coverageRows = (result.stdout ?? '')
  .split(/\r?\n/)
  .filter(line => line.includes('|') && !/^\s*[-|]+\s*$/.test(line));
const failures = coverageRows.filter(line => {
  const metrics = line.split('|').slice(2, 6).map(value => value.trim());
  return metrics.length === 4 && metrics.every(value => /^\d+(?:\.\d+)?$/.test(value)) && metrics.some(value => value !== '100');
});

if (failures.length > 0) {
  console.error('Coverage gaps detected:');
  console.error(failures.join('\n'));
  process.exit(1);
}
