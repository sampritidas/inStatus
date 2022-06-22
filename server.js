const chalk = require("chalk");

const fs = require('fs');
const { access } = require('fs/promises');
const { createServer } = require('net');

const clients = []; //socket
const activeClients = []; //clientAddress,id
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

const server = createServer((socket) => {
  console.log(chalk.blue('Client connected'));

  const clientAddress = `${socket.remoteAddress}  :  ${socket.remotePort}`;
  clients.push(socket);

  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    const parsedData = JSON.parse(data);

    const activeClient = {
      clientAddress, id: parsedData.id, name: parsedData.name
    }
    activeClients.push(activeClient);

    if (parsedData.findActive + '' === 'on') {
      activeClients.forEach(client => {
        socket.write(`🟢 ${client.name} is on\n`)
      })
    }
    // registerId(id);
    // activePerson(id);
    // if (findActive === on) {

    // }

    BroadcastChannel(JSON.stringify(parsedData));
  })


  socket.on('close', () => {
    const index = activeClients.findIndex(client => {
      return JSON.parse(JSON.stringify(client)).clientAddress === clientAddress;
    })

    const disconnecter = activeClients[index].name;

    if (index !== -1) activeClients.splice(index, 1);

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
