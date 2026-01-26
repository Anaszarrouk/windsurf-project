import { HttpInterceptorFn } from '@angular/common/http';

// Exercise 13.1: AuthInterceptor to clone requests and append JWT Bearer token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
