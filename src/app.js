import { createRequire } from "module";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger.js";
import filmesRoutes from "./routes/filmesRoutes.js";
import prisma from "./config/prisma.js";

const require = createRequire(import.meta.url);
require('dotenv').config();

const app = express();


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use(express.json());

app.use("/filmes", filmesRoutes);

try {

	await prisma.$connect();

	console.log("Conexão com o banco de dados estabelecida com sucesso!");
	app.listen(port, () => {
	  console.log(`Servidor rodando em http://localhost:${port}`);
	});
} catch (error) {
	console.error("Erro ao conectar ao banco de dados:", error);

	await prisma.$disconnect();

	process.exitCode = 1;
}

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		return res.status(400).json({ mensagem: "JSON inválido" });
	}

	res.status(500).json({ mensagem: "Erro interno do servidor" });
});

export default app;