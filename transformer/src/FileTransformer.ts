import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export const dataFolderPath = '/share/'

if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
}

export interface task {
    fileName: string;
    fromFileType: string;
    toFileType: string;
    percent: number;
}

interface taskData {
    taskID: string;
    percent: number;
    toFileType: string;
}

function moveToUseless(fileName: string) {
    try {
        fs.rename(
            `${dataFolderPath}${fileName}`,
            `${dataFolderPath}useless/${fileName}`,
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        )
    } catch (e) {
        console.log(e.message);
    }
}

function popTask(target: string, arr: task[]): task | null {
    let index: number = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].fileName == target) {
            index = i;
            break;
        }
    }
    if (index == -1) {
        return null;
    }
    return arr.splice(index, 1)[0];
}

export default class FileTransformer {
    queueingTaskList: task[];
    executingTaskList: task[];
    endedTaskList: task[];
    executingTaskFfmpegCommand: { [key: string]: ffmpeg.FfmpegCommand };

    constructor() {
        this.queueingTaskList = [];
        this.executingTaskList = [];
        this.executingTaskFfmpegCommand = {};
        this.endedTaskList = [];
    }

    listTasks(): taskData[] {
        const getTasks = (arr: task[]): taskData[] => {
            let l = [];
            for (let i = 0; i < arr.length; i++) {
                const task = arr[i];
                l.push({
                    taskID: task.fileName,
                    percent: task.percent,
                    toFileType: task.toFileType,
                })
            }
            return l;
        }
        let list = getTasks(this.executingTaskList);
        list = list.concat(getTasks(this.queueingTaskList));
        list = list.concat(getTasks(this.endedTaskList));
        return list;
    }

    /**
     * adds newTask to queue
     * @param newTask
     */
    addTask(newTask: task) {
        this.queueingTaskList.push(newTask);
        console.log("new task added");
        if (this.executingTaskList.length < 3) {
            this.executeTask();
        }
    }

    /**
     * executes task from queue
     */
    executeTask() {
        const curr = this.queueingTaskList.shift();
        if (curr === undefined) {
            return;
        }
        curr.percent = 0;
        this.executingTaskList.push(curr);
        this.transformVideo(curr);
    }

    /**
     * moves target task to terminatedTaskList
     * function for queueing jobs
     * @param target
     */
    cancelTask(target: string) {
        const poppedTask = popTask(target, this.queueingTaskList);
        if (poppedTask === null) {
            return;
        }
        this.endedTaskList.push(poppedTask);
    }

    /**
     * stops target task ffmpegCommand
     * @param target
     */
    stopTask(target: string) {
        this.executingTaskFfmpegCommand[target].emit("stop");
    }

    /**
     * removes target task from terminatedTaskList
     * @param target
     */
    deleteTask(target: string) {
        const removedTask = popTask(target, this.endedTaskList);
        if (removedTask === null) {
            return;
        }
        moveToUseless(`${target}.${removedTask.toFileType}`);

    }


    /**
     * transforms video or audio with ffmpeg
     * @param request
     */
    transformVideo(request: task): void {
        const fileName = request.fileName;
        const inputFilePath = `${dataFolderPath}${fileName}`;
        const outputFileName = `${fileName}.${request.toFileType}`;
        try {
            const t = ffmpeg(inputFilePath)
                .toFormat(request.toFileType)
                .on('progress', (progress: { percent: number }): void => {
                    if (request.percent === -2) {
                        return;
                    }
                    request.percent = Math.floor(progress.percent * 100) / 100;
                })
                .on("error", (err: any, stdout: any, stderr: any): void => {
                    console.log(`Cannot process video ${fileName}: ${err.message}`);
                })
                .on("stop", () => {
                    console.log(`${fileName} stopped`);
                    moveToUseless(fileName);
                    popTask(fileName, this.executingTaskList);
                    request.percent = -2;
                    this.endedTaskList.push(request);
                    this.executeTask();
                    delete this.executingTaskFfmpegCommand[fileName];
                    t.kill('SIGQUIT');
                })
                .on("end", (stdout: any, stderr: any): void => {
                    popTask(fileName, this.executingTaskList);
                    this.endedTaskList.push(request);
                    request.percent = 100;
                    moveToUseless(fileName);
                    console.log(`Task ${fileName} transcoding succeed!`);
                    this.executeTask();
                })
                .save(`${dataFolderPath}${outputFileName}`);
            this.executingTaskFfmpegCommand[fileName] = t;
        } catch (e) {
            console.log(e);
        }
    }
}
