import 'dotenv/config'
import mongoose from "mongoose";
import app from "./app";
import { Server } from 'http';


let server: Server;
const port = 5000;

async function main() {
    try {
        await mongoose.connect(`${process.env.DB_URI}`)

        console.log('Connected to MongoDB using Mongoose');

        server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
        console.error('Error Connecting to MongoDB:', error);
    }
}

main();

// unhandled promise rejection error
process.on("unhandledRejection", err => {
    console.log('Unhandled Rejection detected! Server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})

// unhandled exception error
process.on("uncaughtException", err => {
    console.log('Uncaught Exception detected! Server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})

// signal termination error
process.on("SIGTERM", err => {
    console.log('Sigterm signal received. Server shutting down..', err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})