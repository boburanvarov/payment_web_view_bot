import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Get token from localStorage (Telegram or web)
  let token = authService.getAuthToken();

  // Fallback to hardcoded token if no stored token (for web development)
  if (!token) {
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MDQzMDk4OSwicGhvbmVOdW1iZXIiOiI5OTg5MTY2Mzc3NDQiLCJleHAiOjE3NjY4NTMyMjgsInVzZXJJZCI6MjgwNDMwOTg5LCJpYXQiOjE3NjQyNjEyMjh9.IZI4VL7Khxj0B4OgzV2Su1g4DNGrSljzIlKtQQ1FI98';
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
