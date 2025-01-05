import { Request, Response } from "express";
import BaseError from "./BaseError";

export default class ErrorHandler {
  static handleError(error: unknown, req: Request<any, any, any, any>, res: Response) {
    if(error instanceof BaseError) {
      return res.status(error.status).json(error.getErrorObject());
    } else {
      return res.status(500).json({message: "Erro inesperado no servidor"});
    }
  }
}