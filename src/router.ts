import Router from 'express';
import UsersController from './controllers/UsersController';

// Definição das rotas da API
const router = Router();

/**
 * Rota para retornar uma mensagem de saudação "Hello World".
 * 
 * Este endpoint recebe uma requisição GET e retorna uma resposta JSON com a mensagem "Hello world".
 * 
 * @param {Express.Request} request O objeto de requisição. Neste caso, não é utilizado.
 * @param {Express.Response} response O objeto de resposta, usado para enviar a mensagem como resposta JSON.
 * 
 * @returns {void}
 */
router.get("/hello-world", (request, response) => {
  response.json({
    message: "Hello world"
  });
});

/**
 * Rota para inserir um novo usuário.
 * 
 * @param {Express.Request} req O objeto de requisição, contendo os dados do usuário no corpo da requisição.
 * @param {Express.Response} res O objeto de resposta, usado para enviar a resposta ao cliente.
 * 
 * @returns {void}
 */
router.post("/users", (req, res) => {
  UsersController.insertUser(req, res);
});

/**
 * Rota para listar todos os usuários.
 * 
 * @param {Express.Request} req O objeto de requisição, que pode conter parâmetros de consulta para filtragem, paginação, etc.
 * @param {Express.Response} res O objeto de resposta, usado para enviar a lista de usuários como resposta.
 * 
 * @returns {void}
 */
router.get("/users", (req, res) => {
  UsersController.listUsers(req, res);
});

/**
 * Rota para obter os dados de um usuário específico.
 * 
 * @param {Express.Request} req O objeto de requisição, contendo o parâmetro `id` na URL.
 * @param {Express.Response} res O objeto de resposta, usado para enviar os dados do usuário solicitado.
 * 
 * @returns {void}
 */
router.get("/users/:id", (req, res) => {
  UsersController.getUser(req, res);
});

/**
 * Rota para atualizar os dados de um usuário específico.
 *
 * @param {Express.Request} req O objeto de requisição, contendo o `id` do usuário na URL e os dados a serem atualizados no corpo da requisição.
 * @param {Express.Response} res O objeto de resposta, usado para enviar a resposta sobre o sucesso ou falha da atualização.
 * 
 * @returns {void}
 */
router.put("/users/:id", (req, res) => {
  UsersController.updateUser(req, res)
});

export default router;