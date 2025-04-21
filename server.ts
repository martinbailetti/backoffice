
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV=='development'?'.env.development':'.env.local'
});

const express = require('express');
const next = require('next');
const port = parseInt(process.env.PORT ?? '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const fs = require('fs');
const path = require('path');

var nServer: any = null;

const logPromises: Promise<number>[] = [];

const server = express();
// Función para agregar logs
const addLog = (mensaje: string) => {
    const date = new Date().toISOString();
    const logMessage = `${date} - ${mensaje}\n`;

    const currentDate = new Date().toISOString().split('T')[0];
    if (!fs.existsSync(process.env.LOG_PATH)) {
        fs.mkdirSync(process.env.LOG_PATH);
    }
    const files = fs.readdirSync(process.env.LOG_PATH);

    let totalSize = 0;

    files.forEach((file: string) => {
        const filePath = path.join(process.env.LOG_PATH, file);
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
        totalSize += fileSizeInMB;
    });

    if (totalSize > Number(process.env.LOG_MAX_SIZE_MB)) {
        files.sort((a: string, b: string) => {
            const fileA = fs.statSync(path.join(process.env.LOG_PATH, a));
            const fileB = fs.statSync(path.join(process.env.LOG_PATH, b));
            return fileA.birthtime.getTime() - fileB.birthtime.getTime();
        });

        let deletedSize = 0;
        while (totalSize > Number(process.env.LOG_MAX_SIZE_MB) && files.length > 1) {
            const oldestFile = files.shift();
            const filePath = path.join(process.env.LOG_PATH, oldestFile);
            const stats = fs.statSync(filePath);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            totalSize -= fileSizeInMB;
            deletedSize += fileSizeInMB;
            fs.unlinkSync(filePath);
        }

        console.log(`Deleted ${deletedSize} KB of log files`);
    }


    const logPromise: Promise<number> = new Promise((resolve, reject) => {
        fs.appendFile(path.join(process.env.LOG_PATH, `logs-${currentDate}.txt`), logMessage, (err: any) => {
            if (err) {
                console.error('Error writing logs', err);
            } else {
                resolve(1);
            }
        });
    });

    logPromises.push(logPromise);
}
const handleExit = (signal: string) => {
    addLog(`Servidor deteniéndose debido a ${signal}`);
    Promise.all(logPromises).then(() => {
        if (nServer) {
            nServer.close(() => {
                console.log('Servidor cerrado');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
};

// Manejo de errores no capturados
process.on('uncaughtException', (err: any) => {
    addLog(`Uncaught Exception: ${err.message}`);
    // process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
    addLog(`Unhandled Rejection: ${err.message}`);
    // process.exit(1);
});

process.on('SIGINT', () => handleExit('SIGINT (Ctrl+C)'));
process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGHUP', () => handleExit('SIGHUP (cierre del terminal)'));

app.prepare().then(() => {

    // Manejo de todas las demás solicitudes por Next.js
    server.all('*', (req: any, res: any) => {
        addLog(`Access to ${req.path}`);
        return handle(req, res);
    });
    // Middleware para manejar errores
    server.use((err: any, req: any, res: any, next: any) => {
        addLog(`Error: ${err.message}`);
        res.status(500).send('Internal Server Error');
    });

    server.post('/log-error', express.json(), (req: any, res: any) => {
        const errorInfo = req.body;
        addLog('Client Error' + errorInfo);
        res.status(204).send();
    });
    nServer = server.listen(port, (err: any) => {
        if (err) throw err;
        console.log(`> Listo en http://localhost:${port}`);
    });

});