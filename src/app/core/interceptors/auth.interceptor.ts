import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

declare const Telegram: any;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Try to get Telegram initData first (for bot users)
  let telegramInitData = '';

  if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
    telegramInitData = Telegram.WebApp.initData;
    console.log('Using Telegram auth:', telegramInitData ? 'Yes' : 'No');
  }

  // If we're in Telegram bot, use initData
  if (telegramInitData) {
    const authReq = req.clone({
      setHeaders: {
        'X-Telegram-Init-Data': telegramInitData
      }
    });
    console.log('Request with Telegram auth:', req.url);
    return next(authReq);
  }

  // Otherwise, use Bearer token for web (fallback)
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MDQzMDk4OSwicGhvbmVOdW1iZXIiOiI5OTg5MTY2Mzc3NDQiLCJleHAiOjE3NjY4NTMyMjgsInVzZXJJZCI6MjgwNDMwOTg5LCJpYXQiOjE3NjQyNjEyMjh9.IZI4VL7Khxj0B4OgzV2Su1g4DNGrSljzIlKtQQ1FI98';

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('Request with Bearer token:', req.url);
  return next(authReq);
};
