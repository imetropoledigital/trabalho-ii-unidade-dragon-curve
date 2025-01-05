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

  static async updateUser(userId: string, newName?: string, newAge?: number) {
   return await User.findByIdAndUpdate(userId, {name: newName, age: newAge}, {new: true}).exec();
  }

  static async listUsers(
    page: number = 1, 
    perPage: number = 10, 
    query: Object = {}, 
    fields: string = ''
  ) {
    const list = await User.find(query, fields, {
      skip: (page-1)*perPage,
      limit: perPage
    }).exec();
    return list;
  }

  static async getUser(userId: string, fields: string) {
    const user = await User.findById(userId, fields);
    return user;
  }
}