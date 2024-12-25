import User from "../models/User";


/**
 * No service ficam as regras de negócio. 
 * Para este pequeno projeto também ficam no service as operações no banco de dados.
 */
export default class UsersService {
  static insertUser(userData: User) : void {
    throw new Error("Method unimplemented");
  }

  static updateUser(userId: number, newUserData: User) : void {
    throw new Error("Method unimplemented");
  }

  static listUsers() : User[] {
    throw new Error("Method unimplemented");
  }

  static getUser(userId: number): User {
    throw new Error("Method unimplemented");
  }
}