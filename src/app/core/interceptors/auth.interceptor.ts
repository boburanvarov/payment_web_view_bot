import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Skip auth for the authentication endpoint itself to prevent circular dependency
  if (req.url.includes('/api/auth/telegram')) {
    return next(req);
  }

  const authService = inject(AuthService);

  // Get token from localStorage (Telegram or web)
  let token = authService.getAuthToken();



  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
