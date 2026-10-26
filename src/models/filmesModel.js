import prisma from "../config/prisma.js";

export function criar ({titulo, diretor, anoLancamento, personagemPrincipal}) {
  return prisma.filmes.create({
    data: {
      titulo,
      diretor,
      anoLancamento,
      personagemPrincipal
    }
  });
}

export async function listar() {
  return await prisma.filmes.findMany({
    orderBy: {
      id: 'asc'
    }
  });
}

export async function obterFilmePorId(id) {
  return await prisma.filmes.findUnique({
    where: { id }
  });
}

export async function editar(id, dados) {
  return await prisma.filmes.update({
    where: { id },
    data: dados
  });
}