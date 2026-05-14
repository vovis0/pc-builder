import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Создайте пул соединений
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Создайте адаптер
const adapter = new PrismaPg(pool);

// Передайте адаптер в PrismaClient
export const prisma = new PrismaClient({ adapter });