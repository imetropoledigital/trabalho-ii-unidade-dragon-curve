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
  static validateInsertBody(body: CreateUserBody): void {
    if(!('name' in body)) throw new ValidationError("Campo 'name' é obrigatório");
    if(!('age' in body)) throw new ValidationError("Campo 'age' é obrigatório");
    const ageNumber = Number(body.age);
    if(isNaN(ageNumber)) throw new ValidationError("Campo 'age' precisa ser um número");
  }

  static validateUpdateBody(body: UpdateUserBody): void {
    if('age' in body && isNaN(Number(body.age))) throw new ValidationError("Campo 'age' precisa ser um número");
  }

  static validateIdParam(params: {id: string}) {
    if(!mongoose.Types.ObjectId.isValid(params.id)) throw new ValidationError("id não é um objectId válido do mongo");
  }

  static validateQueryParams(query: any) {
    if('page' in query) {
      if(isNaN(Number(query.page))) throw new ValidationError("Parâmetro 'page' precisa ser um número");
      if(Number(query.page) < 1) throw new ValidationError("Parâmetro 'page' precisa ser pelo menos 1");
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


  
  static async insertUser(req: Request<{}, any, CreateUserBody, {}>, res: Response){
    try {
      UsersController.validateInsertBody(req.body);
      const insertedUser = await UsersService.insertUser(req.body.name, req.body.age);
      return res.status(201).json({message: "Usuário criado com sucesso", user: insertedUser});
    } catch (error: unknown) {
      ErrorHandler.handleError(error, req, res);
    }
  }

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