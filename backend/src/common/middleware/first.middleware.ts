import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Exercise 4.1: FirstMiddleware to log incoming requests
@Injectable()
export class FirstMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[FirstMiddleware] Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  }
}
