import express from "express";
import {exec} from "child_process";
import FileTransformer, {dataFolderPath, task} from "./FileTransformer";


const PORT = 8081;
const app = express();

const transformer = new FileTransformer();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/', ((req, res) => {
    if (!(req.query.fileName && req.query.fromFileType && req.query.toFileType)) {
        return;
    }
    const apiRequest: task = {
        fileName: req.query.fileName as string,
        fromFileType: req.query.fromFileType as string,
        toFileType: req.query.toFileType as string,
        percent: -1,
    };
    transformer.addTask(apiRequest);
    res.send("hello_world");
}));

app.get('/download/:fileName', ((req, res) => {
    res.download(`${dataFolderPath}${req.params.fileName}`)
}))

app.get('/delete', ((req, res) => {
    if (!req.query.target) {
        res.send('Please specify the value of target');
    }
    transformer.deleteTask(req.query.target as string);
    res.send();
}))

app.get('/stop', ((req, res) => {
    if (!req.query.target) {
        res.send('Please specify the value of target');
    }
    transformer.stopTask(req.query.target as string);
    res.send();
}))

app.get('/percentage', ((req, res) => {
    res.json(JSON.stringify(transformer.listTasks()));
}))

app.get('/system', ((req, res) => {
    // let data: string = '';
    exec('top -bn 1 -m', (err, stdout, stderr) => {
        if (err) {
            res.json(JSON.stringify({'info': err.message}));
        }
        res.json(JSON.stringify({'info': stdout}));
    })
}))


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});