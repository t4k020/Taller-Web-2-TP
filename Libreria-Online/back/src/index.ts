import 'dotenv/config';
import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import { AppRoutes } from "./routes/routes.js";
import { config } from "./config/config.js";
import { prisma } from "./prisma.js"; // 1. Importa tu cliente de Prisma

const app = express();

const port = config.PORT;

app.use(express.json());

app.use(cors());

app.use('/uploads', express.static(path.resolve('uploads')));

// 2. Endpoint de prueba para verificar la conexión con la BD
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error al conectar a la BD:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message
    });
  }
});

app.use(AppRoutes.routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});