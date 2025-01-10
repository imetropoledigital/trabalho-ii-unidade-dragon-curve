export default class BaseError {
  status: number;

  /**
 * Retorna um objeto de erro vazio.
 * 
 * Esta função é de uma classe abstrata, feita para ser implementada 
 * da melhor maneira posteriormente.
 * @returns {Object} Um objeto vazio. Pode ser implementada.
 */
  getErrorObject() : Object {
    return {}
  }
}