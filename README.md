# 🌐 Makhmudov Sardor - Portfolio & Monitoring

2ta alohida web sayt:

## 🔗 Sayt Linklari

### 📱 SAYT 1 - Login Tizimi (Foydalanuvchilar uchun)
**Link:** https://server-liart-theta-11.vercel.app/

Bu saytda:
- ✅ Login / Kirish
- ✅ Ro'yxatdan o'tish
- ✅ Dashboard
- ✅ Quyosh24 reklama

### 🔐 SAYT 2 - Admin Monitoring (Faqat admin uchun)
**Link:** https://server-liart-theta-11.vercel.app/site2.html

Bu saytda:
- ✅ Kim saytga kirgan
- ✅ Qaysi qurilmadan kirgan
- ✅ Qaysi shahardan kirgan
- ✅ Aniq vaqt va sana
- ✅ IP manzil va koordinatalar
- ✅ Real-time monitoring

**Admin Parol:** `sardor2025`

---

24/7 ishlaydigan professional tizim.

## ✨ Xususiyatlar

- ✅ Chiroyli animatsiyali dizayn
- ✅ CAPTCHA himoyasi (serverdan)
- ✅ Brute Force himoyasi
- ✅ Rate Limiting
- ✅ Session boshqaruvi
- ✅ Parol hash qilish (bcrypt)
- ✅ XSS va SQL Injection himoyasi
- ✅ CSRF himoyasi
- ✅ Helmet xavfsizlik headerlari
- ✅ Auto-logout

## 🚀 O'rnatish

1. Node.js o'rnating (agar o'rnatilmagan bo'lsa)
2. Paketlarni o'rnating:
```bash
npm install
```

3. Serverni ishga tushiring:
```bash
npm start
```

4. Brauzerda oching: http://localhost:3000

## 👤 Login Ma'lumotlari

**Foydalanuvchi:**
- Username: `Sardor`
- Parol: `Sardor_developer`

## 🛡️ Xavfsizlik

- Parol kamida 8 belgidan iborat bo'lishi kerak
- Katta harf, kichik harf, raqam va maxsus belgi talab qilinadi
- 5 marta noto'g'ri kiritgandan keyin 15 daqiqaga bloklanadi
- Session 30 daqiqadan keyin avtomatik tugaydi
- Barcha parollar bcrypt bilan hash qilinadi

## 📝 Production uchun

1. `.env` fayl yarating va quyidagilarni qo'shing:
```
PORT=3000
SESSION_SECRET=your-secret-key-here
NODE_ENV=production
```

2. HTTPS sozlang
3. Database ulang (MongoDB, PostgreSQL, va h.k.)
4. PM2 yoki Docker bilan deploy qiling

## 🔧 PM2 bilan 24/7 ishlatish

```bash
npm install -g pm2
pm2 start server.js --name "login-tizimi"
pm2 save
pm2 startup
```

Server avtomatik qayta ishga tushadi va 24/7 ishlaydi.
