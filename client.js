const chalk = require("chalk");
const { createConnection } = require('net');

const socket = createConnection(5555);

const main = (clientId) => {
  socket.setEncoding('utf8');

  socket.on('data', (serverResponse) => {
    console.log(serverResponse);
  })

  socket.on('close', () => {
    console.log('server closed you can\'t continue');
    process.exit();
  })

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    const modifiedChunk = chunk.trim().split(',');
    const [id, findActive] = modifiedChunk;
    const obj = { id, name: process.argv[2], findActive };
    socket.write(JSON.stringify(obj));
  })

  process.stdin.on('end', () => {
    process.stdout.write(clientId + 'you are disconnted');
  })
}

main(process.argv[2]);
