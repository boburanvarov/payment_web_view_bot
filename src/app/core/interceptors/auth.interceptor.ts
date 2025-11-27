import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Faqat kartaxabar.uz API uchun token qo'shish
  if (req.url.includes(environment.apiUrl)) {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4MDQzMDk4OSwicGhvbmVOdW1iZXIiOiI5OTg5MTY2Mzc3NDQiLCJleHAiOjE3NjY4NTMyMjgsInVzZXJJZCI6MjgwNDMwOTg5LCJpYXQiOjE3NjQyNjEyMjh9.IZI4VL7Khxj0B4OgzV2Su1g4DNGrSljzIlKtQQ1FI98';
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
