export class BadRequestError extends Error {
  status: number;
  constructor(msg: string) {
    super(msg);
    this.status = 400;
  }
}
