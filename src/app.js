import express from "express";

const app = express();

app.use(express.json());

const filmes = [
  {
    id: 1,
    titulo: "A Viagem de Chihiro",
    diretor: "Hayao Miyazaki",
    anoLancamento: 2001,
    personagemPrincipal: "Chihiro Ogino"
  },
  {
    id: 2,
    titulo: "Meu Vizinho Totoro",
    diretor: "Hayao Miyazaki",
    anoLancamento: 1988,
    personagemPrincipal: "Satsuki Kusakabe"
  },
  {
    id: 3,
    titulo: "O Castelo Animado",
    diretor: "Hayao Miyazaki",
    anoLancamento: 2004,
    personagemPrincipal: "Sophie Hatter"
  }
];

app.get("/filmes", (req, res) => {
  res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  res.json(filme);
});

app.post("/filmes", (req, res) => {
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
});

app.put("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  const { titulo, diretor, anoLancamento, personagemPrincipal } = req.body;

  if (!titulo || !diretor || !anoLancamento || !personagemPrincipal) {
    return res.status(400).json({ mensagem: "Todos os campos do filme são obrigatórios" });
  }

  filmes[indice] = {
    id,
    titulo,
    diretor,
    anoLancamento,
    personagemPrincipal
  };

  res.json(filmes[indice]);
});

app.delete("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  const [filmeRemovido] = filmes.splice(indice, 1);
  res.json({ mensagem: "Filme removido com sucesso", filme: filmeRemovido });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ mensagem: "JSON inválido" });
  }

  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

export default app;