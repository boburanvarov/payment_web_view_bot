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

  // Fallback to hardcoded token if no stored token (for web development)
  if (!token) {
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MDQzMDk4OSwicGhvbmVOdW1iZXIiOiI5OTg5MTY2Mzc3NDQiLCJleHAiOjE3NjgyNDI0ODksInVzZXJJZCI6MjgwNDMwOTg5LCJpYXQiOjE3NjU2NTA0ODl9.fBxkT4ystsRlgeSZhWoPh9udNreDYH5fa7sh7Bs5GFg';
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
