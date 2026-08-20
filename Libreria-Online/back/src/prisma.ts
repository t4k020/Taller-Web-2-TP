import { createRequire } from 'module';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './config/config.js';

// Cargar PrismaClient usando el resolver CJS de Node para evitar el SyntaxError en ESM
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

// 1. Configurar el pool de Postgres
const pool = new pg.Pool({
  connectionString: config.db,
});

// 2. Instanciar el adaptador de Prisma
const adapter = new PrismaPg(pool);

// 3. Crear e exportar la instancia de Prisma
export const prisma = new PrismaClient({
  adapter,
});