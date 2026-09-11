import express from "express";
import bcrypt from "bcrypt";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catálogo de Filmes do Studio Ghibli",
      version: "1.0.0",
      description: "Documentação da API do catálogo de filmes do Studio Ghibli."
    }
  },
  apis: ["./src/app.js"]
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

/**
 * @openapi
 * components:
 *   schemas:
 *     Filme:
 *       type: object
 *       required:
 *         - titulo
 *         - diretor
 *         - anoLancamento
 *         - personagemPrincipal
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: A Viagem de Chihiro
 *         diretor:
 *           type: string
 *           example: Hayao Miyazaki
 *         anoLancamento:
 *           type: integer
 *           example: 2001
 *         personagemPrincipal:
 *           type: string
 *           example: Chihiro Ogino
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: Token
 */

/**
 * @openapi
 * /filmes:
 *   get:
 *     tags:
 *       - Filme
 *     summary: Lista todos os filmes
 *     description: Retorna todos os filmes cadastrados no catálogo.
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 titulo: A Viagem de Chihiro
 *                 diretor: Hayao Miyazaki
 *                 anoLancamento: 2001
 *                 personagemPrincipal: Chihiro Ogino
 */

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

/**
 * @openapi
 * /filmes/{id}:
 *   get:
 *     tags:
 *       - Filme
 *     summary: Busca um filme por ID
 *     description: Retorna os dados de um filme usando seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será buscado.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: A Viagem de Chihiro
 *               diretor: Hayao Miyazaki
 *               anoLancamento: 2001
 *               personagemPrincipal: Chihiro Ogino
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado
 */
app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado" });
  }

  res.json(filme);
});

/**
 * @openapi
 * /filmes:
 *   post:
 *     tags:
 *       - Filme
 *     summary: Cadastra um novo filme
 *     description: Cria um filme no catálogo. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: Princesa Mononoke
 *             diretor: Hayao Miyazaki
 *             anoLancamento: 1997
 *             personagemPrincipal: San
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               titulo: Princesa Mononoke
 *               diretor: Hayao Miyazaki
 *               anoLancamento: 1997
 *               personagemPrincipal: San
 *       400:
 *         description: Algum campo obrigatório não foi informado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Todos os campos do filme são obrigatórios
 *       401:
 *         description: Token ausente ou inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Token ausente ou inválido
 */
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

/**
 * @openapi
 * /filmes/{id}:
 *   patch:
 *     tags:
 *       - Filme
 *     summary: Atualiza parcialmente um filme
 *     description: Atualiza um ou mais campos de um filme. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será atualizado.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             personagemPrincipal: Chihiro
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: A Viagem de Chihiro
 *               diretor: Hayao Miyazaki
 *               anoLancamento: 2001
 *               personagemPrincipal: Chihiro
 *       400:
 *         description: Nenhum campo válido foi informado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Informe pelo menos um campo válido para atualizar
 *       401:
 *         description: Token ausente ou inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Token ausente ou inválido
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado
 */
app.patch("/filmes/:id", autorizar, (req, res) => {
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
});

/**
 * @openapi
 * /filmes/{id}:
 *   delete:
 *     tags:
 *       - Filme
 *     summary: Exclui um filme
 *     description: Remove um filme do catálogo. É necessário enviar um Bearer Token válido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será excluído.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme removido com sucesso
 *               filme:
 *                 id: 1
 *                 titulo: A Viagem de Chihiro
 *                 diretor: Hayao Miyazaki
 *                 anoLancamento: 2001
 *                 personagemPrincipal: Chihiro Ogino
 *       401:
 *         description: Token ausente ou inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Token ausente ou inválido
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado
 */
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