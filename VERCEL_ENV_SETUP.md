# 🔧 Vercel Environment Variables Sozlash

## 1️⃣ Vercel Dashboard ga kiring:
https://vercel.com/dashboard

## 2️⃣ Loyihangizni toping:
- **sardor-web** (yoki sizning project nomingiz)

## 3️⃣ Settings → Environment Variables:
1. **Settings** tugmasini bosing
2. **Environment Variables** bo'limiga o'ting

## 4️⃣ Quyidagi 3 ta o'zgaruvchini qo'shing:

### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0
Environment: Production, Preview, Development (BARCHA 3 TASINI TANLANG!)
```

### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: kiro-secure-jwt-secret-key-2024-sardor-developer-12345
Environment: Production, Preview, Development (BARCHA 3 TASINI TANLANG!)
```

### Variable 3: NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (BARCHA 3 TASINI TANLANG!)
```

## 5️⃣ Save va Redeploy:
1. **Save** tugmasini bosing
2. **Deployments** bo'limiga o'ting
3. Oxirgi deployment ni toping
4. **⋯** (3 nuqta) → **Redeploy** tugmasini bosing

## 6️⃣ Deployment kutish:
- 2-3 daqiqa kutish kerak
- Status: **Building** → **Ready**

## 7️⃣ Test qilish:
1. Vercel URL ni oching (masalan: https://sardor-web.vercel.app)
2. Register sahifasida yangi user yarating
3. Login qiling
4. Main site ga o'ting

## ✅ Tayyor!

Endi har safar GitHub ga push qilganingizda, Vercel avtomatik deploy qiladi!

---

## 🆘 Muammo bo'lsa:

### Xato: "MONGODB_URI environment variable yo'qolgan"
- Environment Variables to'g'ri qo'shilganini tekshiring
- Barcha 3 ta environment (Production, Preview, Development) tanlanganini tekshiring
- Redeploy qiling

### Xato: "MongoServerError: bad auth"
- MongoDB Atlas → Security → Network Access
- 0.0.0.0/0 qo'shilganini tekshiring
- Username va parol to'g'riligini tekshiring

### Deployment muvaffaqiyatsiz bo'lsa:
- Vercel Dashboard → Deployments → Oxirgi deployment
- **View Function Logs** tugmasini bosing
- Xatolarni o'qing va tuzating
