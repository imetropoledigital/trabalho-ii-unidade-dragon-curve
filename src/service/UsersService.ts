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
  /**
   * Insere um novo usuário no banco de dados.
   * 
   * Este método verifica se já existe um usuário com o mesmo nome no banco de dados e, se
   * o nome já existir, lança um erro de restrição. Caso contrário, cria e salva 
   * um novo usuário com o nome e idade fornecidos nos parâmetros da função.
   * 
   * @async
   * @param {string} name O nome do usuário a ser inserido.
   * @param {number} age A idade do usuário a ser inserido.
   * @throws {ConstraintError} Se já existir um usuário com o mesmo nome.
   * @returns {Promise<User>} Uma `Promise` resolvida com o usuário criado.
   */

  static async insertUser(name: string, age: number) {
    const existingUser = await User.findOne({name}).exec();
    if(existingUser !== null) throw new ConstraintError("Nome de usuário já foi escolhido");
    const user = new User({name, age});
    return await user.save();
  }

  /**
   * Atualiza as informações de um usuário no banco de dados.
   * 
   * Este método verifica a existência do usuário pelo ID e, se um novo nome for fornecido, 
   * verifica se o nome já está em uso por outro usuário. Se, e somente se, essas condições
   * forem satisfeitas os dados do usuário serão atualizados.
   * 
   * @async
   * @param {string} userId O id do usuário a ser atualizado.
   * @param {string} [newName] (Opcional) O novo nome para o usuário.
   * @param {number} [newAge] (Opcional) A nova idade para o usuário.
   * @throws {NotFoundError} Se o usuário não for encontrado pelo ID fornecido.
   * @throws {ConstraintError} Se o novo nome já estiver em uso por outro usuário.
   * @returns {Promise<User | null>} Uma `Promise` resolvida com o objeto atualizado do usuário ou `null` se o ID não existir.
   */

  static async updateUser(userId: string, newName?: string, newAge?: number) {
    const user = await User.findById(userId).exec();

    if(user === null) throw new NotFoundError(`Usuário não encontrado`);
    if(newName !== undefined && newName !== user.name) {
      const existingUser = await User.findOne({name: newName}).exec();
      if(existingUser !== null) throw new ConstraintError("Nome de usuário já foi escolhido");
    }

    return await User.findByIdAndUpdate(userId, {name: newName, age: newAge}, {new: true}).exec();
  }

  /**
   * Lista usuários com base em parâmetros de paginação, filtros e projeção de campos.
   * 
   * Este método busca usuários no banco de dados, aplicando paginação
   * e permitindo filtrar os resultados de acordo com a `query` fornecida. 
   * A projeção de campos também pode ser configurada através do parâmetro `fields`.
   * Cada um dos parâmetros tem o seu próprio valor padrão.
   * 
   * @async
   * @param {number} [page=1] A página a ser exibida. O valor padrão é 1.
   * @param {number} [perPage=10] A quantidade de usuários por página. O valor padrão é 10.
   * @param {Object} [query={}] O filtro para a consulta, no formato de query. O valor padrão sendo vazio.
   * @param {string} [fields=''] A projeção de campos. O valor padrão sendo vazio.
   * @throws {ValidationError} Se a query fornecida for inválida.
   * @returns {Promise<User[]>} Uma `Promise` resolvida com uma lista de usuários.
   */

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

  /**
   * Busca um usuário no banco de dados com base no id e indica com quais campos retornar.
   * 
   * Este método busca um cadastro de usuários pelo id no banco de dados. 
   * Ele aceita uma projeção de campos, permitindo retornar apenas os campos especificados.
   * 
   * @async
   * @param {string} userId O id do usuário a ser buscado.
   * @param {string} fields Uma string representando os campos a serem retornados.
   * @throws {NotFoundError} Se nenhum usuário for encontrado com o id fornecido.
   * @returns {Promise<User>} Uma `Promise` resolvida com o objeto do usuário encontrado.
   */

  static async getUser(userId: string, fields: string) {
    const user = await User.findById(userId, fields).exec();
    if(user === null) throw new NotFoundError("Usuário não encontrado");
    return user;
  }
}