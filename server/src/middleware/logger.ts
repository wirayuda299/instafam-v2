import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {

  const data = {
    query: req.query,
    params: req.params,
    body: req.body
  }
  console.log("Request -> ", data)

  console.log("Response -> ", res.json())
  next();
};

