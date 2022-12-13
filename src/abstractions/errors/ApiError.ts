export interface IError {
  status: number;
  fields: {
      name: {
          message: string;
      };
  };
  message: string;
  errors: any
}

class ApiError extends Error implements IError {
  public status = 500;

  public success = false;

  public errors: any;

  public fields: { name: { message: string } };

  constructor(msg: string, status: number, errors: string[]) {
    super();
    this.message = msg;
    this.status = status;
    this.errors = errors;
  }
}

export default ApiError;
