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

  process.stdin.on('data', (chunk) => {
    socket.write(clientId + ':' + chunk);
  })

  process.stdin.on('end', () => {
    process.stdout.write(clientId + 'you are disconnted');
  })
}

main(process.argv[2]);
