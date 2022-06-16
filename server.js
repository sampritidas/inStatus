const fs = require('fs');
const { access } = require('fs/promises');
const { createServer } = require('net');

const clients = []; //socket
const activeClints = []; //clientAddress,id
const maxClients = 9;

const BroadcastChannel = (clientData) => {
  clients.forEach((socket) => {
    socket.write(clientData);
  })
};

const isIdRegister = (id, registeredUser) => {
  return registerId.includes(id);
};

const registerId = (id) => {
  const registeredUser = fs.readFileSync('allUser.txt', 'utf8');
  if (!isIdRegister(id, registeredUser)) {
    registeredUser.push(id);
    fs.writeFileSync('allUser.txt', 'utf8');
  }
};

const activePerson = () => {

};

const server = createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}  :  ${socket.remotePort}`;
  clients.push(socket);

  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    const parsedData = JSON.parse(data);
    const activeClint = {
      clientAddress, id: parsedData.id, name: parsedData.name
    }
    activeClints.push(activeClint);
    // registerId(id);
    // activePerson(id);
    // if (findActive === on) {

    // }

    BroadcastChannel(JSON.stringify(parsedData));
  })


  socket.on('close', (data) => {
    const index = activeClints.findIndex(client => {
      return JSON.parse(JSON.stringify(client)).clientAddress === clientAddress;
    })

    const disconnecter = activeClints[index].name;

    if (index !== -1) activeClints.splice(index, 1);

    clients.forEach((socket) => {
      socket.write(`${disconnecter} is disconnected`);
    });
    console.log("client closed", disconnecter);
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

// server.on('connection', (socket) => {
//   const clientAddress = `${socket.remoteAddress}  :  ${socket.remotePort}`;
//   console.log(`new client connected: ${clientAddress}`);
// });
