import { Request, Response } from "express";
import UsersService from "../service/UsersService";
import ErrorHandler from "../errors/ErrorHandler";
import ValidationError from "../errors/ValidationError";
import mongoose from "mongoose";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const DEFAULT_QUERY = {};
const DEFAULT_FIELDS = "";

type ListUsersQuery = {
  page?: number,
  perPage?: number,
  fields?: string,
  query?: string
};

type GetUserQuery = {
  fields?: string
};

type CreateUserBody = {
  name: string,
  age: number
}

type UpdateUserBody = {
  name?: string,
  age?: number
}

/*
  No controller fica a lógica de validação e a conversão do json para o 
  tipo de dados da aplicação
*/
export default class UsersController {

  /**
   * Valida o corpo da requisição para inserção de um novo usuário.
   * 
   * Este método verifica se os campos obrigatórios `name` e `age` estão presentes no corpo
   * da requisição e se o campo `age` é um número válido. 
   * Caso algum desses requisitos falhe, um erro de validação será lançado.
   * 
   * @param {CreateUserBody} body O corpo da requisição, contendo as informações do usuário que será inserido.
   * @throws {ValidationError} Se os campos obrigatórios estiverem ausentes ou se o campo 'age' não for um número válido.
   * @returns {void} Retorna o unit.
   */

  static validateInsertBody(body: CreateUserBody): void {
    if(!('name' in body)) throw new ValidationError("Campo 'name' é obrigatório");
    if(!('age' in body)) throw new ValidationError("Campo 'age' é obrigatório");
    const ageNumber = Number(body.age);
    if(isNaN(ageNumber)) throw new ValidationError("Campo 'age' precisa ser um número");
  }

  /**
   * Valida o corpo da requisição para atualização de um usuário.
   * 
   * Este método verifica se o campo `age` está presente no corpo da requisição e se o 
   * valor fornecido é um número. 
   * Caso contrário, um erro de validação será lançado.
   * 
   * @param {UpdateUserBody} body O corpo da requisição contendo os dados a serem atualizados.
   * @throws {ValidationError} Se o campo `age` for fornecido e não for um número válido.
   * @returns {void} Retorna o unit.
   */

  static validateUpdateBody(body: UpdateUserBody): void {
    if('age' in body && isNaN(Number(body.age))) 
      throw new ValidationError("Campo 'age' precisa ser um número");
  }

  /**
   * Valida o parâmetro id para garantir que seja um ObjectId válido do MongoDB.
   * 
   * Este método verifica se o id fornecido no parâmetro de rota é um ObjectId válido.
   * Caso o id não seja válido, um erro de validação é lançado.
   * 
   * @param {Object} params O objeto contendo um possível id.
   * @throws {ValidationError} Se o id fornecido não for um ObjectId válido do MongoDB.
   * @returns {void} Retorna o unit.
   */

  static validateIdParam(params: {id: string}) {
    if(!mongoose.Types.ObjectId.isValid(params.id)) 
      throw new ValidationError("id não é um objectId válido do mongo");
  }

  /**
   * Valida os parâmetros de consulta `query` passados em uma requisição.
   * 
   * Este método verifica se a página e os elementos dela são maiores ou iguais a 1 e se
   * `query` pode ser um JSON válido.
   * Caso algum dos parâmetros não atenda aos critérios, um erro de validação será lançado.
   * 
   * @param {any} query Os parâmetros da consulta da requisição.
   * @throws {ValidationError} Se algum parâmetro não for válido, como `page`, `perPage` sendo um número inválido ou `query` não sendo um JSON válido.
   * @returns {void} Retorna o unit.
   */

  static validateQueryParams(query: any) {
    if('page' in query) {
      if(isNaN(Number(query.page))) 
        throw new ValidationError("Parâmetro 'page' precisa ser um número");
      if(Number(query.page) < 1) 
        throw new ValidationError("Parâmetro 'page' precisa ser pelo menos 1");
    }

    if('perPage' in query) {
      if(isNaN(Number(query.perPage))) throw new ValidationError("Parâmetro 'perPage' precisa ser um número");
      if(Number(query.perPage) < 1) throw new ValidationError("Parâmetro 'perPage' precisa ser pelo menos 1");
    }

    if('query' in query) {
      try {
        JSON.parse(query.query);
      } catch(error: unknown) {
        throw new ValidationError("Parâmetro 'query' deve ser um JSON válido");
      }
    }
  }

  /**
   * Insere um novo usuário no banco de dados.
   * 
   * Este método é responsável por validar os dados fornecidos no corpo da requisição, se
   *  válidos criará um novo usuário utilizando os dados (nome e idade) e 
   * retornará uma resposta com os detalhes sobre o usuário criado. 
   * Em caso de erro, ele chama o handler de erro para processar e retornar o erro adequado.
   * 
   * @param {Request} req O objeto da requisição, que contém o corpo da requisição com os dados do novo usuário.
   * @param {Response} res O objeto da resposta, que será utilizado para retornar o status e os dados ao cliente.
   * @throws {handleError} Em caso de erros inesperados.
   * @returns {Promise<void>} Retorna o unit e envia uma resposta HTTP com o status 201 e os dados do usuário criado.
   */
  
  static async insertUser(req: Request<{}, any, CreateUserBody, {}>, res: Response){
    try {
      UsersController.validateInsertBody(req.body);
      const insertedUser = await UsersService.insertUser(req.body.name, req.body.age);
      return res.status(201).json({message: "Usuário criado com sucesso", user: insertedUser});
    } catch (error: unknown) {
      ErrorHandler.handleError(error, req, res);
    }
  }

  /**
   * Atualiza as informações de um usuário no banco de dados.
   * 
   * Este método valida os dados enviados no corpo da requisição, verifica se o id do usuário
   * é válido, e em seguida tenta atualizar as informações do usuário com os dados fornecidos. 
   * Se a atualização for bem-sucedida, ele retorna uma resposta com o status 201 e os dados do usuário atualizado.
   * Caso ocorra algum erro, ele chama o manipulador de erro para processar e retornar o erro adequado.
   * 
   * @param {Request} req O objeto da requisição, que contém os parâmetros de URL (id do usuário) e o corpo da requisição (novos dados do usuário).
   * @param {Response} res O objeto da resposta, que será utilizado para retornar o status e os dados ao cliente.
   * @throws {handleError} Em caso de erros inesperados.
   * @returns {Promise<void>} Retorna unit e envia uma resposta HTTP com o status 201 e os dados do usuário atualizado.
   */

  static async updateUser(req: Request<{id: string}, any, UpdateUserBody, {}>, res: Response) {
    try {
      UsersController.validateUpdateBody(req.body);
      UsersController.validateIdParam(req.params);
      const updatedUser = await UsersService.updateUser(req.params.id, req.body.name, req.body.age);
      return res.status(201).json({message: "Usuário atualizado com sucesso", user: updatedUser});
    } catch(error: unknown) {
      ErrorHandler.handleError(error, req, res);
    }
  }

  /**
   * Lista os usuários no banco de dados com base nos parâmetros fornecidos na requisição.
   * 
   * Este método valida os parâmetros da query (como `page`, `perPage`, `query`, e `fields`), 
   * constrói a consulta para obter os usuários e retorna a lista de usuários paginada.
   * Caso ocorra algum erro, ele chama o manipulador de erro para processar e retornar o erro adequado.
   * 
   * @param {Request} req O objeto da requisição, que contém os parâmetros de query para paginar e filtrar os usuários.
   * @param {Response} res O objeto da resposta, que será utilizado para retornar os dados ao cliente.
   * @throws {handleError} Em caso de erros inesperados.
   * @returns {Promise<void>} Retorna unit e envia uma resposta HTTP com a lista de usuários e informações sobre a páginação.
   */

  static async listUsers(req: Request<{}, any, {}, ListUsersQuery>, res: Response) {
    try {
      UsersController.validateQueryParams(req.query);

      const {page, perPage, query, fields} = req.query;
      const currentPage = page === undefined ? DEFAULT_PAGE : Number(page);
      const currentPerPage = perPage === undefined ? DEFAULT_PER_PAGE : Number(perPage);
      const ALL_COMMAS = /,/g;

      const users = await UsersService.listUsers(
        currentPage,
        currentPerPage,
        query  === undefined ? DEFAULT_QUERY : JSON.parse(query),
        fields === undefined ? DEFAULT_FIELDS : fields.replace(ALL_COMMAS, ' ')
      );
      return res.status(200).json({page: currentPage, perPage: currentPerPage, result: users});
    } catch(error: unknown) {
      ErrorHandler.handleError(error, req, res);
    }
  }

  /**
   * Obtém as informações de um usuário com base no ID fornecido.
   * 
   * Este método valida o parâmetro id fornecido na URL, bem como os parâmetros de query para definir quais
   * campos retornar. Em seguida, ele busca o usuário no banco de dados e retorna os dados do usuário solicitado.
   * Caso ocorra algum erro, ele chama o manipulador de erro para processar e retornar o erro adequado.
   * 
   * @param {Request} req O objeto da requisição, que contém o parâmetro de URL id do usuário e a query com os campos a serem retornados.
   * @param {Response} res O objeto da resposta, que será utilizado para retornar os dados do usuário.
   * @throws {handleError} Em caso de erros inesperados.
   * @returns {Promise<void>} Retorna unit e envia uma resposta HTTP com o status 200 e os dados do usuário solicitado.
   */

  static async getUser(req: Request<{id: string}, any, {}, GetUserQuery>, res: Response) {
    try {
      UsersController.validateIdParam(req.params);
      UsersController.validateQueryParams(req.params);
      const user = await UsersService.getUser(
        req.params.id, 
        req.query.fields === undefined ? DEFAULT_FIELDS : req.query.fields.replace(',', ' ')
      );
      return res.status(200).json({user});
    } catch(error: unknown) {
      ErrorHandler.handleError(error, req, res);
    }
  }
}