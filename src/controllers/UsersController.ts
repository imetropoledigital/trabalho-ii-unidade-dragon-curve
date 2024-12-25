import { Request, Response } from "express";
import UsersService from "../service/UsersService";
import User from "../models/User";

/*
  No controller fica a lógica de validação e a conversão do json para o tipo de dados da aplicação
*/
export default class UsersController {
  static insertUser(req: Request, res: Response) : void {
    const user = new User("a", 0);
    UsersService.insertUser(user);
  }

  static updateUser(req: Request, res: Response) : void {
    throw new Error("Method unimplemented");
  }

  static listUsers(req: Request, res: Response) : void {
    throw new Error("Method unimplemented");
  }

  static getUser(req: Request, res: Response) : void {
    throw new Error("Method unimplemented");
  }
}