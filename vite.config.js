import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  // './' garante que assets usem caminhos relativos,
  // funcionando tanto em GitHub Pages (/<repo>/) quanto na raiz.
  base: './',

  server: {
    host: '0.0.0.0',
    watch: {
      ignored: ['**/sheets.json']
    }
  },

  plugins: [
    // Plugin de API local: só ativo em dev (npm run dev).
    // Em produção (GitHub Pages) o front usa IndexedDB/localStorage.
    isDev && {
      name: 'sheets-json-storage',
      configureServer(server) {
        const filePath = path.resolve(process.cwd(), 'sheets.json');

        server.middlewares.use('/api/sheets', (req, res, next) => {
          if (req.method === 'GET') {
            if (fs.existsSync(filePath)) {
              try {
                const data = fs.readFileSync(filePath, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'sheets.json not found' }));
            }
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, count: Array.isArray(parsed) ? parsed.length : 1 }));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ].filter(Boolean)
});
