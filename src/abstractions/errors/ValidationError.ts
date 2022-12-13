class ValidationError extends Error {
    constructor(message: any) {
      super(message);
      this.name = 'ValidationError';
    }
}

export default ValidationError;