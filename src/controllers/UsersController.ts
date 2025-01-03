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
        return;
      }
      const insertedUser = await UsersService.insertUser(name, age);
      res.status(201).json({message: "Usuário criado com sucesso", user: insertedUser});
    } catch (error) {
      //console.error(error);
      res.status(500).json({ error: "Erro ao criar o usuário" });
      //throw("Erro ao informar valores");
    }
  }

  static async updateUser(req: Request, res: Response) {
    const {name, age} = req.body
    const { id } = req.params;
    try {
      if(!name || !age){
        res.status(400).json({ error: "Nome e idade são obrigatórios" });
        return;
      }

      const updatedUser = await UsersService.updateUser(id, name, age);
      res.status(201).json({message: "Usuário atualizado com sucesso", user: updatedUser});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar o usuário" });
      //throw("Erro ao informar valores");
    }
  }

  static listUsers(req: Request, res: Response) : void {
    throw new Error("Method unimplemented");
  }

  static getUser(req: Request, res: Response) : void {
    throw new Error("Method unimplemented");
  }
}