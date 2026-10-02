import filmes from "../data/filmes.js";

export function obterFilmePorId(req, res) {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  res.json(filme);
}

export function obterTodosFilmes(req, res) {
  res.json(filmes);
}

export function adicionarFilme(req, res){
  const { titulo, diretor, anoLancamento, personagemPrincipal } = req.body;

  if (!titulo || !diretor || !anoLancamento || !personagemPrincipal) {
    return res.status(400).json({ mensagem: "Todos os campos do filme são obrigatórios" });
  }

  const novoFilme = {
    id: filmes.length ? Math.max(...filmes.map((filme) => filme.id)) + 1 : 1,
    titulo,
    diretor,
    anoLancamento,
    personagemPrincipal
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
}

export function atualizarFilme (req, res)  {
  const id = Number(req.params.id);
  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  const camposPermitidos = ["titulo", "diretor", "anoLancamento", "personagemPrincipal"];
  const camposRecebidos = Object.keys(req.body);
  const camposInvalidos = camposRecebidos.some((campo) => !camposPermitidos.includes(campo));

  if (!camposRecebidos.length || camposInvalidos) {
    return res.status(400).json({ mensagem: "Informe pelo menos um campo válido para atualizar" });
  }

  filmes[indice] = { ...filmes[indice], ...req.body };

  res.json(filmes[indice]);
}

export function removerFilme(req, res) {
  const id = Number(req.params.id);
  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  const [filmeRemovido] = filmes.splice(indice, 1);
  res.json({ mensagem: "Filme removido com sucesso", filme: filmeRemovido });
}