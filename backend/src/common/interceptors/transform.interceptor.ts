import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Exercise 8.2: TransformInterceptor to wrap all responses in a 'data' object
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<{ data: T }> {
    return next.handle().pipe(
      map((data) => ({ data })),
    );
  }
}
