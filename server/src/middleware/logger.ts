import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {

  const data = {
    query: req.query,
    params: req.params,
    body: req.body ?? "No body attached"
  }
  console.log("Request -> ", data)

  next();
};

