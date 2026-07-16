import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import { Server } from 'http';
import { seedAdmin } from "./utils/seedAdmin";
import { startBookingWorker } from "./modules/gamebooking/bookingWorker";

let server: Server;

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully!');



        server = app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    }
    catch (error) {
        console.log("Error Starting the server: ", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}




(async () => {
    main()
    await seedAdmin()
    startBookingWorker(); //
})();




const handleGracefulShutdown = (signal: string) => {
    console.log(`\n ${signal} received. Shutting down gracefully...`);


    if (server) {
        server.close(async () => {
            console.log('HTTP server closed. No longer accepting new requests.');


            await prisma.$disconnect();
            console.log('Database connection closed.');

            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};


// POSIX Signals
process.on('SIGTERM', () => {
    console.log("SIGTERM")
    handleGracefulShutdown('SIGTERM')
});

process.on('SIGINT', () => {
    console.log("SIGINT")
    handleGracefulShutdown('SIGINT')

});
