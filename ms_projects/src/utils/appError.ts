import ErrorPlemas from "./Error";

class AppError extends ErrorPlemas {
  constructor(message: string) {
    super(message);
  }
}

class MissingParameter extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "MissingParameter";
    this.code = 422;
  }
}
class ElementNotFound extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "ElementNotFound";
    this.code = 404;
  }
}
class MalformedObjectId extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "MalformedObjectId";
    this.code = 400;
  }
}
class UnknownError extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "UnknownError";
    this.code = 500;
  }
}
class UnAuthorized extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "UnAuthorized";
    this.code = 401;
  }
}
class NothingChanged extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "No changes has been made";
    this.code = 304;
  }
}
class ValidationError extends ErrorPlemas {
  constructor(message: string) {
    super(message);
    this.name = "Validation Error";
    this.code = 403;
  }
}

export {
  UnAuthorized,
  UnknownError,
  MalformedObjectId,
  ElementNotFound,
  MissingParameter,
  AppError,
  NothingChanged,
  ValidationError
};
