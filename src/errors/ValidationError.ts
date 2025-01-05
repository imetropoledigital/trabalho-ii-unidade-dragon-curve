import BaseError from "./BaseError";

export default class ValidationError extends BaseError {
  status = 400;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  getErrorObject() {
    return {message: this.message};
  }
}