import app from "./app.js";
import prisma from "./config/database.js";
import { initializeAdmin } from "./utils/setup.js";



const PORT = parseInt(process.env.PORT || '8080', 10);


const startServer = async () => {
    try{
        await prisma.$connect();
        console.log('✅ Database connected');

        await initializeAdmin();


       app.listen(PORT, ()=> {
           console.log(`🚀 Server running on port ${PORT}`);
       })

       process.on('SIGTERM', async () => {
              console.log('SIGTERM received, shutting down gracefully');
              await prisma.$disconnect();
              process.exit(0);
       })

    }catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
startServer();