class ErrorPlemas implements Error {
  name: string = "PlemasAppError";
  code?: number;
  status: string = "fail";
  message: string;
  stack?: string;

  constructor(
    message: string,
    stack?: string
  ) {
    this.message = message;
    this.stack = stack;


  }
}


export default ErrorPlemas
