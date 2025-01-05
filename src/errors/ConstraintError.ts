import BaseError from "./BaseError";

export default class ConstraintError extends BaseError {
  status = 401;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  getErrorObject() {
    return {message: this.message};
  }
}