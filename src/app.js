import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

const usuarios = [];
const tokenAutenticado = "token-autenticado-ghibli-123";

function autorizar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : authorization;

  if (token !== tokenAutenticado) {
    return res.status(401).json({ mensagem: "Token ausente ou inválido" });
  }

  next();
}

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

app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios" });
  }

  const usuarioExistente = usuarios.find((usuario) => usuario.email === email);

  if (usuarioExistente) {
    return res.status(400).json({ mensagem: "E-mail já cadastrado" });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const novoUsuario = {
    id: usuarios.length ? Math.max(...usuarios.map((usuario) => usuario.id)) + 1 : 1,
    nome,
    email,
    senha: senhaCriptografada
  };

  usuarios.push(novoUsuario);

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso",
    usuario: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios" });
  }

  const usuario = usuarios.find((usuario) => usuario.email === email);

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }

  res.json({
    mensagem: "Login realizado com sucesso",
    token: tokenAutenticado,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  });
});

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

app.post("/filmes", autorizar, (req, res) => {
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

app.put("/filmes/:id", autorizar, (req, res) => {
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

app.delete("/filmes/:id", autorizar, (req, res) => {
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