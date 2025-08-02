import 'dotenv/config'
import mongoose from "mongoose";
import app from "./app";
import { Server } from 'http';
import { createAdmin } from './app/utils/seedAdmin';


let server: Server;
const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`)

        console.log('Connected to MongoDB using Mongoose');

        server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}.`);
        })

    } catch (error) {
        console.error('Error Connecting to MongoDB:', error);
        process.exit(1);
    }
}

(async () => {
    await startServer()
    await createAdmin()
})();


const shutdown = () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection detected! Server shutting down...', error);
    shutdown();
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception detected! Server shutting down...', error);
    shutdown();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Process terminated.');
        });
    }
});