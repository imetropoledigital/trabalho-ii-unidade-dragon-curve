import Router from 'express';

// Definição das rotas da API
const router = Router();

router.get("/hello-world", (request, response) => {
  response.json({
    message: "Hello world"
  });
});

export default router;