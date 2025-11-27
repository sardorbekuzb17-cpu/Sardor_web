# 📝 Environment Variables Qo'shish (Qadam-ba-Qadam)

## Link ochildi:
https://vercel.com/sardor/sardor-web/settings/environment-variables

---

## QADAM 1: MONGODB_URI qo'shish

1. **"Add New"** tugmasini bosing (yoki **"Environment Variables"** bo'sh bo'lsa, **"Add"** tugmasini bosing)

2. Quyidagilarni kiriting:

**Key (Name):**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0
```

**Environments:** (BARCHA 3 TASINI BELGILANG!)
- ✅ Production
- ✅ Preview  
- ✅ Development

3. **Save** tugmasini bosing

---

## QADAM 2: JWT_SECRET qo'shish

1. Yana **"Add New"** tugmasini bosing

2. Quyidagilarni kiriting:

**Key (Name):**
```
JWT_SECRET
```

**Value:**
```
kiro-secure-jwt-secret-key-2024-sardor-developer-12345
```

**Environments:** (BARCHA 3 TASINI BELGILANG!)
- ✅ Production
- ✅ Preview
- ✅ Development

3. **Save** tugmasini bosing

---

## QADAM 3: NODE_ENV qo'shish

1. Yana **"Add New"** tugmasini bosing

2. Quyidagilarni kiriting:

**Key (Name):**
```
NODE_ENV
```

**Value:**
```
production
```

**Environments:** (BARCHA 3 TASINI BELGILANG!)
- ✅ Production
- ✅ Preview
- ✅ Development

3. **Save** tugmasini bosing

---

## ✅ TAYYOR!

Endi 3 ta Environment Variable ko'rinishi kerak:
- MONGODB_URI
- JWT_SECRET
- NODE_ENV

Menga "tayyor" deb yozing, men redeploy qilaman!
