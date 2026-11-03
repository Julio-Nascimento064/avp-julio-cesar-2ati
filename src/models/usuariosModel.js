import prisma from '../config/db.js';

export function criar({nome, email, senhaHash}){
    return prisma.usuarios.create({
        data: {
            nome,
            email,
            senhaHash
        },
        select:{
            id: true,
            nome: true,
            email: true,
            senhaHash: true
        }
    });
}

export function buscaPorEmail(email){
    return prisma.usuarios.findUnique({
        where: {
            email
        }
    });
}
