import { Request, Response } from "express";
import UsersService from "../service/UsersService";

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
  static validateInsertBody(body: CreateUserBody): void {
    if(!body.name) throw TypeError('Campo "name" é obrigatório');
    if(!body.age) throw TypeError('Campo "age" é obrigatório');
  }

  static async insertUser(req: Request<{}, any, CreateUserBody, {}>, res: Response){
    try {
      this.validateInsertBody(req.body);
      const insertedUser = await UsersService.insertUser(req.body.name, req.body.age);
      return res.status(201).json({message: "Usuário criado com sucesso", user: insertedUser});
    } catch (error: unknown) {
      if(error instanceof TypeError) {
        return res.status(400).json({message: error.message});
      } else {
        return res.status(500).json({message: "erro inesperado no servidor"});
      }
    }
  }

  static async updateUser(req: Request<{id: string}, any, UpdateUserBody, {}>, res: Response) {
    const {name, age} = req.body
    const { id } = req.params;
    const updatedUser = await UsersService.updateUser(id, name, age);
    return res.status(201).json({message: "Usuário atualizado com sucesso", user: updatedUser});
  }

  static async listUsers(req: Request<{}, any, {}, ListUsersQuery>, res: Response) {
    const {page, perPage, query, fields} = req.query;
    const users = await UsersService.listUsers(
      page || DEFAULT_PAGE,
      perPage || DEFAULT_PER_PAGE,
      query  === undefined ? DEFAULT_QUERY : JSON.parse(query),
      fields === undefined ? DEFAULT_FIELDS : fields.replace(',', ' ')
    );
    return res.status(200).json({page, perPage, result: users});
  }

  static async getUser(req: Request<{id: string}, any, {}, GetUserQuery>, res: Response) {
    const {id} = req.params;
    const {fields} = req.query;
    const user = await UsersService.getUser(
      id, 
      fields === undefined ? DEFAULT_FIELDS : fields.replace(',', ' ')
    );
    return res.status(200).json({user});
  }
}