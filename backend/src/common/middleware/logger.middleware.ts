import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Exercise 4.2: LoggerMiddleware to log IP, User-Agent, and Method
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[LoggerMiddleware] IP: ${ip} | Method: ${method} | URL: ${url} | User-Agent: ${userAgent}`);
    next();
  }
}
