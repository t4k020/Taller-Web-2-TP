import env from "env-var";

export const config = {

    PORT: env.get('PORT').required().asPortNumber(),
    db: env.get('DATABASE_URL')
         .default(process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || '')
         .required()
         .asString(),
    
}   