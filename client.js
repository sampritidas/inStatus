// const { exec } = require('child_process');

// const main = () => {
//   console.log('bash start');
//   exec('bash sign-in.sh', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`error: ${error.message}`);
//       return;
//     }

//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }

//     console.log(`stdout:\n${stdout}`);
//   });
// }

// main();
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
    const modifiedChunk = JSON.parse(chunk).trim().split(',');
    const [id, fa] = modifiedChunk;
    const obj = { id: id, name: process.argv[2], findActive: fa };
    socket.write(JSON.stringify(obj));
  })

  process.stdin.on('end', () => {
    process.stdout.write(clientId + 'you are disconnted');
  })
}

main(process.argv[2]);
