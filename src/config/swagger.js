import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catálogo de Filmes do Studio Ghibli",
      version: "1.0.0",
      description: "Documentação da API do catálogo de filmes do Studio Ghibli."
    }
  },
  apis: ["./src/app.js", "./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Catálogo de Filmes do Studio Ghibli"
};

export { swaggerUiOptions };
export default swaggerSpec;