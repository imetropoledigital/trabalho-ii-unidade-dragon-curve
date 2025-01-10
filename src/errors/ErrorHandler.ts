import { Request, Response } from "express";
import BaseError from "./BaseError";

export default class ErrorHandler {

  /**
   * Lida com erros ocorridos na aplicação e envia uma resposta adequada para o cliente.
   * 
   * A função verifica se o erro é uma instância de um erro personalizado (BaseError) e, se 
   * assim for, retorna o erro com o status e mensagem definidos. 
   * Se o erro for inesperado, retorna um erro genérico com o código de status 500 e 
   * uma mensagem padrão.
   * 
   * @param {unknown} error - O erro que ocorreu. Pode ser qualquer tipo de erro.
   * @param {Request} req - O objeto de requisição do Express.
   * @param {Response} res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
   * @returns {Response} A resposta HTTP com o status e o objeto de erro adequado.
   */

  static handleError(error: unknown, req: Request<any, any, any, any>, res: Response) {
    if(error instanceof BaseError) {
      return res.status(error.status).json(error.getErrorObject());
    } else {
      return res.status(500).json({message: "Erro inesperado no servidor"});
    }
  }
}