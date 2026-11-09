import { Router } from "express";
import {
  adicionarFilme,
  atualizarFilme,
  obterFilmePorId,
  obterTodosFilmes,
  removerFilme
} from "../controllers/filmesController.js";
import { autorizar } from "../middlewares/autentificar.js";

const filmesRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Filme:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         titulo:
 *           type: string
 *         diretor:
 *           type: string
 *         anoLancamento:
 *           type: integer
 *         personagemPrincipal:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: Token
 */

/**
 * @swagger
 * /filmes:
 *   get:
 *     tags: [Filme]
 *     summary: Lista todos os filmes
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso.
 */
filmesRoutes.get("/", obterTodosFilmes);

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     tags: [Filme]
 *     summary: Busca um filme por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme encontrado.
 *       404:
 *         description: Filme não encontrado.
 */
filmesRoutes.get("/:id", obterFilmePorId);

/**
 * @swagger
 * /filmes:
 *   post:
 *     tags: [Filme]
 *     summary: Cadastra um filme
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filme'
 *     responses:
 *       201:
 *         description: Filme cadastrado.
 *       400:
 *         description: Campos obrigatórios ausentes.
 *       401:
 *         description: Token ausente ou inválido.
 */
filmesRoutes.post("/", autorizar, adicionarFilme);

/**
 * @swagger
 * /filmes/{id}:
 *   patch:
 *     tags: [Filme]
 *     summary: Atualiza parcialmente um filme
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filme'
 *     responses:
 *       200:
 *         description: Filme atualizado.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Filme não encontrado.
 */
filmesRoutes.patch("/:id", autorizar, atualizarFilme);

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     tags: [Filme]
 *     summary: Exclui um filme
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme excluído.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Filme não encontrado.
 */
filmesRoutes.delete("/:id", autorizar, removerFilme);

export default filmesRoutes;
