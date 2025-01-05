import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  status = 404;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  getErrorObject() {
    return {message: this.message};
  }
}