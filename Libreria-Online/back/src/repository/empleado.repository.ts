import { prisma } from "../prisma.js"
import { Prisma } from "../prisma/client.js"

export class EmpleadoRepository{
    async  findAllEmpleados() {

        const empleados = await prisma.usuarios.findMany();
        
        return empleados;
        
    }
}