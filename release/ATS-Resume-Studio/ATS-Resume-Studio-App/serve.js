#!/usr/bin/env node
/**
 * ATS Resume Studio - Local Zero-Dependency Server (Node.js Fallback)
 * 100% In-Browser & Private. No external APIs or network calls.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { exec } = require('child_process');

// 1. Base application directory strictly on __dirname (never relies on cwd)
const DIRECTORY = __dirname;
let currentPort = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.gz': 'application/gzip',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function verifyAndOpenBrowser(url, port) {
  let attempts = 0;
  function checkSocket() {
    attempts++;
    const client = net.createConnection({ port, host: '127.0.0.1' }, () => {
      client.end();
      const openCmd =
        process.platform === 'darwin'
          ? `open "${url}"`
          : process.platform === 'win32'
          ? `start "" "${url}"`
          : `xdg-open "${url}"`;
      exec(openCmd);
    });
    client.on('error', () => {
      if (attempts < 40) {
        setTimeout(checkSocket, 50);
      }
    });
  }
  checkSocket();
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '' || reqPath === '/' || reqPath === '/app') reqPath = '/app/';
    else if (reqPath === '/privacy') reqPath = '/privacy/';
    else if (reqPath === '/terms') reqPath = '/terms/';

    if (reqPath.endsWith('/')) reqPath += 'index.html';

    const filePath = path.join(DIRECTORY, reqPath);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      startServer(port + 1);
    } else {
      console.error(`❌ Server error: ${err.message}`);
      process.exit(1);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}/app/`;
    console.log('============================================================');
    console.log('   ATS RESUME STUDIO — LOCAL SERVER RUNNING');
    console.log('============================================================');
    console.log(`   Status:        Listening on 127.0.0.1:${port} (Active)`);
    console.log(`   Server URL:    ${url}`);
    console.log(`   Engine:        Node.js (${process.version})`);
    console.log(`   App Directory: ${DIRECTORY}`);
    console.log('------------------------------------------------------------');
    console.log('   Opening your web browser automatically...');
    console.log('   KEEP THIS TERMINAL WINDOW OPEN while using the app.');
    console.log('   Press Ctrl+C to shut down the server when finished.');
    console.log('============================================================');

    verifyAndOpenBrowser(url, port);
  });
}

process.on('SIGINT', () => {
  console.log('\n\nATS Resume Studio server stopped. Have a wonderful day!');
  process.exit(0);
});

startServer(currentPort);
