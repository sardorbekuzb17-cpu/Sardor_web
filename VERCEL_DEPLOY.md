# 🚀 Vercel ga Deploy Qilish (MongoDB bilan)

## ✅ Tayyor Bo'lgan Narsalar:
- MongoDB Atlas sozlangan
- Local test muvaffaqiyatli
- Barcha API lar MongoDB bilan ishlaydi

## 1️⃣ Vercel Environment Variables Qo'shish

### A. Vercel Dashboard ga kiring:
https://vercel.com/dashboard

### B. Project Settings ga o'ting:
1. O'z loyihangizni toping
2. **Settings** → **Environment Variables** ga o'ting

### C. Quyidagi o'zgaruvchilarni qo'shing:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0` | Production, Preview, Development |
| `JWT_SECRET` | `kiro-secure-jwt-secret-key-2024-sardor-developer-12345` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

**MUHIM:** Har bir o'zgaruvchi uchun barcha environmentlarni (Production, Preview, Development) tanlang!

## 2️⃣ Vercel CLI orqali Deploy

### A. Vercel CLI o'rnatish (agar yo'q bo'lsa):
```bash
npm install -g vercel
```

### B. Login qilish:
```bash
vercel login
```

### C. Deploy qilish:
```bash
vercel
```

Savollar:
- **Set up and deploy?** → Yes
- **Which scope?** → O'z akkauntingizni tanlang
- **Link to existing project?** → Yes (agar mavjud bo'lsa) yoki No
- **Project name?** → sardor-web (yoki istalgan nom)

### D. Production ga deploy:
```bash
vercel --prod
```

## 3️⃣ GitHub orqali Automatic Deploy

### A. GitHub Repository yaratish:
```bash
git add .
git commit -m "MongoDB integration complete"
git push origin main
```

### B. Vercel da GitHub ni ulash:
1. Vercel Dashboard → **Add New Project**
2. **Import Git Repository** → GitHub ni tanlang
3. Repository ni tanlang
4. **Environment Variables** qo'shing (yuqoridagi jadvaldan)
5. **Deploy** tugmasini bosing

### C. Automatic Deployment:
Endi har safar GitHub ga push qilganingizda, Vercel avtomatik deploy qiladi!

## 4️⃣ Test Qilish

Deploy tugagach:
1. Vercel URL ni oching (masalan: `https://sardor-web.vercel.app`)
2. **Register** sahifasida yangi foydalanuvchi yarating
3. **Login** qiling
4. **Monitor** sahifasida visitor tracking ko'ring

## 5️⃣ Custom Domain (Ixtiyoriy)

Agar o'z domeningiz bo'lsa:
1. **Settings** → **Domains** ga o'ting
2. Domeningizni qo'shing
3. DNS sozlamalarini yangilang

## 🔍 Muammolarni Hal Qilish

### Xato: "MONGODB_URI environment variable yo'qolgan"
**Yechim:** Vercel Dashboard da Environment Variables to'g'ri qo'shilganini tekshiring

### Xato: "MongoServerError: bad auth"
**Yechim:** 
- MongoDB Atlas da Network Access tekshiring (0.0.0.0/0 qo'shilgan bo'lishi kerak)
- Username va parol to'g'riligini tekshiring

### Xato: "Function execution timeout"
**Yechim:** MongoDB Atlas cluster uyg'onishi uchun 10-15 soniya kutish kerak (Free tier da)

## 📊 Deployment Status

Deploy tugagach, quyidagilarni tekshiring:
- ✅ Login ishlaydi
- ✅ Register ishlaydi
- ✅ Visitor tracking ishlaydi
- ✅ MongoDB da ma'lumotlar saqlanadi

## 🎉 Tayyor!

Endi dasturingiz to'liq production da ishlaydi va MongoDB bilan integratsiya qilingan!

**Production URL:** https://your-project.vercel.app
**MongoDB:** Atlas Cloud Database
**Status:** 24/7 Online
