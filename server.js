const { createServer } = require('net');

const clients = [];
const maxClients = 9;

const BroadcastChannel = (clientData) => {
  clients.forEach((socket) => {
    socket.write(clientData);
  })
};

const server = createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}  :  ${socket.remotePort}`;
  clients.push(socket);

  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    BroadcastChannel(data);
  })

  socket.on('close', (data) => {
    const index = clients.findIndex((sock) => {
      return (sock.remoteAddress === socket.remoteAddress) &&
        (sock.remotePort === socket.remotePort);
    });
    if (index !== -1) clients.splice(index, 1);
    clients.forEach((socket) => {
      socket.write(`${clientAddress} disconnected\n`);
    });
    console.log(`connection closed: ${clientAddress}`);
  });

  process.stdin.on('data', (chunk) => {
    socket.write('Server says: ' + chunk);
  })

  if (clients.length === maxClients) {
    console.log('Max clients reached');
    server.close();
  }
});

server.listen(5555);

server.on('connection', (socket) => {
  const clientAddress = `${socket.remoteAddress}  :  ${socket.remotePort}`;
  console.log(`new client connected: ${clientAddress}`);
});
