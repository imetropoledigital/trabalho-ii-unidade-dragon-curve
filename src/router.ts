import Router from 'express';
import UsersController from './controllers/UsersController';

// Definição das rotas da API
const router = Router();

router.get("/hello-world", (request, response) => {
  response.json({
    message: "Hello world"
  });
});

router.post("/users", UsersController.insertUser);
router.get("/users", UsersController.listUsers);
router.get("/users/:id", UsersController.getUser);
router.put("/users/:id", UsersController.updateUser);

export default router;