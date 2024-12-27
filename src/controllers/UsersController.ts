import { Request, Response } from "express";
import UsersService from "../service/UsersService";
import User from "../models/User";

/*
  No controller fica a lógica de validação e a conversão do json para o 
  tipo de dados da aplicação
*/
export default class UsersController {
  static async insertUser(req: Request, res: Response) : Promise<void> {
    const {name, age} = req.body
    try {
      if(!name || !age){
        res.status(400).json({ error: "Nome e idade são obrigatórios" });
      }
      const user = new User(name, age);
      UsersService.insertUser(user);
      res.status(201).json({message: "Usuário criado com sucesso", user});
    } catch (error) {
      //console.error(error);
      res.status(500).json({ error: "Erro ao criar o usuário" });
      //throw("Erro ao informar valores");
    }
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