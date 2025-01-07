import Router from 'express';
import UsersController from './controllers/UsersController';

// Definição das rotas da API
const router = Router();

router.get("/hello-world", (request, response) => {
  response.json({
    message: "Hello world"
  });
});

router.post("/users", (req, res) => {
  UsersController.insertUser(req, res);
});
router.get("/users", (req, res) => {
  UsersController.listUsers(req, res);
});
router.get("/users/:id", (req, res) => {
  UsersController.getUser(req, res);
});
router.put("/users/:id", (req, res) => {
  UsersController.updateUser(req, res)
});

export default router;