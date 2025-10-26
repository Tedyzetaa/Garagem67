import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

createServer((req, res) => {
  let filePath = join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
}).listen(3000, () => {
  console.log('🚀 Servidor local: http://localhost:3000');
});