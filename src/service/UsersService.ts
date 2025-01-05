import mongoose from "mongoose";
import ConstraintError from "../errors/ConstraintError";
import NotFoundError from "../errors/NotFoundError";
import User from "../models/User";
import ValidationError from "../errors/ValidationError";

/**
 * No service ficam as regras de negócio. 
 * Para este pequeno projeto também ficam no service as operações no banco de dados.
 */
export default class UsersService {
  static async insertUser(name: string, age: number) {
    const existingUser = await User.findOne({name}).exec();
    if(existingUser !== null) throw new ConstraintError("Nome de usuário já foi escolhido");
    const user = new User({name, age});
    return await user.save();
  }

  static async updateUser(userId: string, newName?: string, newAge?: number) {
    const user = await User.findById(userId).exec();

    if(user === null) throw new NotFoundError(`Usuário não encontrado`);
    if(newName !== undefined && newName !== user.name) {
      const existingUser = await User.findOne({name: newName}).exec();
      if(existingUser !== null) throw new ConstraintError("Nome de usuário já foi escolhido");
    }

    return await User.findByIdAndUpdate(userId, {name: newName, age: newAge}, {new: true}).exec();
  }

  static async listUsers(
    page: number = 1, 
    perPage: number = 10, 
    query: Object = {}, 
    fields: string = ''
  ) {
    try {
      const list = await User.find(query, fields, {
        skip: (page-1)*perPage,
        limit: perPage
      }).exec();
      return list;
    } catch(error: unknown) {
      if(error instanceof mongoose.Error.CastError) {
        throw new ValidationError("Parâmetro 'query' é inválido");
      } else {
        throw error;
      }
    }
   
  }

  static async getUser(userId: string, fields: string) {
    const user = await User.findById(userId, fields).exec();
    if(user === null) throw new NotFoundError("Usuário não encontrado");
    return user;
  }
}