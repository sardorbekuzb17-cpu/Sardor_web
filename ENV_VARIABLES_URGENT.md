# ⚠️ MUHIM: Environment Variables Qo'shish Kerak!

## Muammo:
Vercel da Environment Variables yo'q - shuning uchun API ishlamayapti!

## ✅ TEZKOR YECHIM (2 daqiqa):

### 1. Bu link ochildi:
https://vercel.com/sardor/sardor-web/settings/environment-variables

### 2. Quyidagi 3 ta variable qo'shing:

---

#### Variable 1: MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0
Environment: ✅ Production ✅ Preview ✅ Development (BARCHA 3 TASINI BELGILANG!)
```

**Add** tugmasini bosing

---

#### Variable 2: JWT_SECRET
```
Key: JWT_SECRET
Value: kiro-secure-jwt-secret-key-2024-sardor-developer-12345
Environment: ✅ Production ✅ Preview ✅ Development (BARCHA 3 TASINI BELGILANG!)
```

**Add** tugmasini bosing

---

#### Variable 3: NODE_ENV
```
Key: NODE_ENV
Value: production
Environment: ✅ Production ✅ Preview ✅ Development (BARCHA 3 TASINI BELGILANG!)
```

**Add** tugmasini bosing

---

### 3. Redeploy qiling:

Terminal da:
```bash
vercel --prod
```

Yoki Vercel Dashboard da:
- **Deployments** → Oxirgi deployment → **⋯** → **Redeploy**

---

## ✅ Tayyor!

Environment variables qo'shilgandan keyin, sayt to'liq ishlaydi!

**Eslatma:** Har bir variable uchun BARCHA 3 ta environment (Production, Preview, Development) ni tanlashni unutmang!
