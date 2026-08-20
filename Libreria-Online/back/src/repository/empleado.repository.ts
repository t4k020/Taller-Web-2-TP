import { prisma } from "../prisma"
import { Prisma } from "../prisma/client"

export class EmpleadoRepository{
    async  findAllEmpleados() {

        const empleados = await prisma.usuarios.findMany();
        
        return empleados;
        
    }
}