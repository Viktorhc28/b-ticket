require('dotenv').config();

const Server = require('./src/modules/server');
const server = new Server();
server.listen();