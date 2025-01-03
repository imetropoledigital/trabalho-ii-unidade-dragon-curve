import User from "../models/User";


/**
 * No service ficam as regras de negócio. 
 * Para este pequeno projeto também ficam no service as operações no banco de dados.
 */
export default class UsersService {
  static async insertUser(name: string, age: number) {
    const user = new User({name, age});
    return await user.save();
  }

  static async updateUser(userId: string, newName: string, newAge: number) {
   return await User.findByIdAndUpdate(userId, {name: newName, age: newAge}, {new: true}).exec();
  }

  static listUsers() {
    throw new Error("Method unimplemented");
  }

  static getUser(userId: number) {
    throw new Error("Method unimplemented");
  }
}