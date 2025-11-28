# Environment Configuration Setup

## Problem

Git da `environment.ts` faylini commit qilganingizda, har safar local o'zgarishlar (masalan, `apiUrl: ''`) push bo'lib ketadi.

## Solution

Environment fayllar `.gitignore` ga qo'shildi va template fayllar yaratildi.

## Changes Made

### 1. Updated `.gitignore`

Added:
```
# Environment files (local development configs)
/src/environments/environment.ts
/src/environments/environment.prod.ts
```

### 2. Created Template Files

- `environment.template.ts` - Development template
- `environment.prod.template.ts` - Production template

Bu template fayllar Git da saqlanadi, lekin haqiqiy `environment.ts` va `environment.prod.ts` local da qoladi.

## How to Use

### First Time Setup (Har bir developer)

1. Template fayllardan nusxa ko'chirish:
```bash
# Development
cp src/environments/environment.template.ts src/environments/environment.ts

# Production  
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
```

2. Local environment.ts ni o'zgartirish:
```typescript
export const environment = {
  production: false,
  apiUrl: '',  // Local development uchun bo'sh
  version: '1.0.11'
};
```

### Git Cache Cleanup (Bir marta qilish kerak)

Environment fayllar allaqachon Git da bo'lsa, ularni cache dan o'chirish kerak:

```bash
# Git cache dan o'chirish (fayllar o'chib ketmaydi, faqat Git tracking to'xtaydi)
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.prod.ts

# Commit qilish
git add .gitignore
git add src/environments/environment.template.ts
git add src/environments/environment.prod.template.ts
git commit -m "chore: Add environment templates and ignore environment files"

# Push qilish
git push
```

## Benefits

✅ Local development settings Git ga tushmaydi  
✅ Har bir developer o'z local konfigini ishlatishi mumkin  
✅ `.gitignore` da bo'lgani uchun accidental commit bo'lmaydi  
✅ Template fayllar orqali yangi developerlar osongina setup qiladi  

## Note

Endi `environment.ts` va `environment.prod.ts` fayldagi o'zgarishlar Git ga tushma ydi. Faqat `environment.template.ts` fayllaridagi o'zgarishlar commit bo'ladi.
