// backend/server.cjs
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.db = router.db; // make db accessible
server.use(middlewares);
server.use(auth);
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server + Auth running on http://localhost:${PORT}`);
});
