import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import PrismaPackage from '@prisma/client';
import { config } from './config/config.js';

// Extraer PrismaClient para compatibilidad ESM en Vercel
const { PrismaClient } = PrismaPackage;

// 1. Crear el Pool de conexiones con la librería 'pg'
const pool = new pg.Pool({
  connectionString: config.db,
});

// 2. Inicializar el adaptador de Prisma pasándole el pool
const adapter = new PrismaPg(pool);

// 3. Crear la instancia de PrismaClient
export const prisma = new PrismaClient({
  adapter,
});