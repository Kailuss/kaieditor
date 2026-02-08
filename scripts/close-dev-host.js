#!/usr/bin/env node
'use strict';

const { exec } = require('child_process');

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        return reject({ err, stderr });
      }
      resolve(stdout);
    });
  });
}

async function findAndKillDevHost() {
  try {
    if (process.platform === 'win32') {
      // Windows: usar PowerShell para listar procesos con CommandLine
      const psCommand = 'Get-Process | Where-Object {$_.CommandLine -like "*--extensionDevelopmentPath*"} | Select-Object -ExpandProperty Id';
      const output = await execPromise(`powershell -NoProfile -Command "${psCommand}"`);
      
      const pids = output
        .split(/[\r\n]+/)
        .map(line => parseInt(line.trim(), 10))
        .filter(pid => !isNaN(pid) && pid !== process.pid);

      if (pids.length === 0) {
        console.log('[close-dev-host] No Extension Development Host instances found');
        return;
      }

      for (const pid of pids) {
        try {
          process.kill(pid);
          console.log(`[close-dev-host] ✓ Killed Extension Development Host (PID: ${pid})`);
        } catch (err) {
          console.warn(`[close-dev-host] ⚠ Failed to kill PID ${pid}:`, err.message);
        }
      }
    } else {
      // macOS / Linux: usar ps
      const output = await execPromise('ps -ax -o pid= -o command=');
      const lines = output.split(/[\r\n]+/);
      const pids = [];

      for (const line of lines) {
        if (line.includes('--extensionDevelopmentPath')) {
          const parts = line.trim().split(/\s+/);
          const pid = parseInt(parts[0], 10);
          if (!isNaN(pid) && pid !== process.pid) {
            pids.push(pid);
          }
        }
      }

      if (pids.length === 0) {
        console.log('[close-dev-host] No Extension Development Host instances found');
        return;
      }

      for (const pid of pids) {
        try {
          process.kill(pid);
          console.log(`[close-dev-host] ✓ Killed Extension Development Host (PID: ${pid})`);
        } catch (err) {
          console.warn(`[close-dev-host] ⚠ Failed to kill PID ${pid}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.warn('[close-dev-host] Error detecting/killing processes:', err.message || err);
  }
}

findAndKillDevHost()
  .then(() => {
    console.log('[close-dev-host] Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('[close-dev-host] Unexpected error:', err);
    process.exit(1);
  });
