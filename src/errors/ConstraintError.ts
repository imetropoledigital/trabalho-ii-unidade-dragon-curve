import BaseError from "./BaseError";

export default class ConstraintError extends BaseError {
  status = 401;
  message: string;

  /**
   * Cria uma nova instância de erro com uma mensagem personalizada.
   * 
   * @param {string} message - A mensagem de erro personalizada.
   */

  constructor(message: string) {
    super();
    this.message = message;
  }

  /**
   * Retorna um objeto com a mensagem de erro.
   * 
   * Retorna a messagem com a string do erro.
   * 
   * @returns {Object} Um objeto contendo a mensagem de erro.
   */

  getErrorObject() {
    return {message: this.message};
  }
}