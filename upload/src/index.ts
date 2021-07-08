import express from 'express';
import * as io from 'socket.io';
import ss from 'socket.io-stream';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { exec } from 'child_process';

const port = 3000;
const dataFolderPath = '/share/';

const app = express();

// check data folder exists or not, if not create one
if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath);
}

const socketServer = new io.Server(8787, {
  cors: {
    origin: `http://localhost:8080`,
    methods: ['GET', 'POST']
  }
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/system', ((req, res) => {
  let data: string = '';
  exec('top -bn 1 -i -c', (err, stdout, stderr) =>{
    if (err){
      data = err.message;
      return;
    }
    data = stdout;
  })
  res.send(data);
}))

socketServer.on('connection', (socket) => {
  ss(socket).on(
    'uploadFileStream',
    function(
      stream: any,
      data: {
        size: number
        fileName: string
      }
    ) {
      /*
      let loc = 0
      let substring = data.fileName
      while (true){
        if (substring.search(/\./) == -1){
          break;
        } else {

          loc = substring.search(/\./)
          substring = substring.substring(loc+1)
        }
      }
      const fileType = substring;
      console.log(`${dataFolderPath}${nanoid()}.${fileType}`)
      stream.pipe(fs.createWriteStream(`${dataFolderPath}${nanoid()}.${fileType}`))
       */
      const uploadFileID = nanoid();
      stream.pipe(fs.createWriteStream(`${dataFolderPath}${uploadFileID}`));
      socket.emit('returnUploadFileID', uploadFileID);
    }
  );
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
