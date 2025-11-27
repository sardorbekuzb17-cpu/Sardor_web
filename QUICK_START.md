# 🚀 Tezkor Boshlash

## 1️⃣ MongoDB Atlas Sozlash (5 daqiqa)

### A. Akkaunt yaratish
1. https://www.mongodb.com/cloud/atlas/register ga kiring
2. Google yoki Email bilan ro'yxatdan o'ting
3. **FREE** (M0) cluster yarating

### B. Database User yaratish
1. **Security → Database Access**
2. **Add New Database User**
3. Username: `sardor_admin`
4. Parol: `MySecurePass123!` (yoki o'zingizniki)
5. **Read and write to any database** tanlang

### C. Network Access
1. **Security → Network Access**
2. **Add IP Address**
3. **Allow Access from Anywhere** (0.0.0.0/0)

### D. Connection String olish
1. **Database → Clusters → Connect**
2. **Connect your application**
3. Connection string ni nusxalang

## 2️⃣ .env.local Fayl Yaratish

Loyihangiz papkasida `.env.local` fayl yarating:

```env
MONGODB_URI=mongodb+srv://sardor_admin:MySecurePass123!@cluster0.xxxxx.mongodb.net/loginSystem?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345
NODE_ENV=production
```

**MUHIM:** `xxxxx` ni o'z cluster ID ingiz bilan almashtiring!

## 3️⃣ Database Initsializatsiya

```bash
npm run init-db
```

Bu buyruq:
- ✅ MongoDB ga ulanadi
- ✅ Default user yaratadi: `Sardor` / `Sardor_developer`
- ✅ Indexlarni sozlaydi

## 4️⃣ Local Test

```bash
npm start
```

Brauzerda: http://localhost:3000

## 5️⃣ Vercel Deploy

### A. Vercel CLI orqali
```bash
npm install -g vercel
vercel login
vercel
```

### B. Environment Variables qo'shish
Vercel Dashboard da:
- `MONGODB_URI` = (yuqoridagi connection string)
- `JWT_SECRET` = `my-super-secret-jwt-key-12345`
- `NODE_ENV` = `production`

### C. Redeploy
```bash
vercel --prod
```

## 6️⃣ Test Qilish

1. **Register:** Yangi foydalanuvchi yaratish
2. **Login:** Kirib ko'rish
3. **Monitor:** Visitor tracking ko'rish

## ✅ Tayyor!

Endi dasturingiz to'liq ishlaydi:
- ✅ MongoDB da ma'lumotlar saqlanadi
- ✅ Login/Register ishlaydi
- ✅ Visitor tracking ishlaydi
- ✅ Production da deploy qilish mumkin

## 🆘 Yordam Kerakmi?

Batafsil qo'llanma: `MONGODB_SETUP.md`
