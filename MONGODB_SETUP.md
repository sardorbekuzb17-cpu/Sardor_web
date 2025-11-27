# MongoDB Atlas Sozlash Qo'llanmasi

## 1. MongoDB Atlas Akkaunt Yaratish

1. **MongoDB Atlas saytiga kiring:** https://www.mongodb.com/cloud/atlas/register
2. **Bepul akkaunt yarating** (Google yoki Email bilan)
3. **Free Tier (M0)** ni tanlang - bu 512MB bepul storage

## 2. Cluster Yaratish

1. **"Create a Cluster"** tugmasini bosing
2. **Cloud Provider:** AWS (yoki istalgan)
3. **Region:** Eng yaqin region ni tanlang (masalan: Frankfurt, Germany)
4. **Cluster Tier:** M0 Sandbox (FREE)
5. **Cluster Name:** loginSystemCluster (yoki istalgan nom)
6. **"Create Cluster"** tugmasini bosing (2-3 daqiqa kutish kerak)

## 3. Database User Yaratish

1. **Security → Database Access** ga o'ting
2. **"Add New Database User"** tugmasini bosing
3. **Authentication Method:** Password
4. **Username:** `sardor_admin` (yoki istalgan)
5. **Password:** Kuchli parol yarating va saqlang! (masalan: `MySecurePass123!`)
6. **Database User Privileges:** "Read and write to any database"
7. **"Add User"** tugmasini bosing

## 4. Network Access Sozlash

1. **Security → Network Access** ga o'ting
2. **"Add IP Address"** tugmasini bosing
3. **"Allow Access from Anywhere"** ni tanlang (0.0.0.0/0)
   - Production da faqat kerakli IP larni qo'shing!
4. **"Confirm"** tugmasini bosing

## 5. Connection String Olish

1. **Database → Clusters** ga o'ting
2. **"Connect"** tugmasini bosing
3. **"Connect your application"** ni tanlang
4. **Driver:** Node.js
5. **Version:** 4.1 or later
6. **Connection string ni nusxalang:**
   ```
   mongodb+srv://sardor_admin:<password>@loginsystemcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 6. .env.local Fayl Yaratish

Loyihangiz papkasida `.env.local` fayl yarating:

```env
MONGODB_URI=mongodb+srv://sardor_admin:MySecurePass123!@loginsystemcluster.xxxxx.mongodb.net/loginSystem?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
NODE_ENV=production
```

**MUHIM:**
- `<password>` ni o'z parolingiz bilan almashtiring
- `xxxxx` ni o'z cluster ID ingiz bilan almashtiring
- Database nomi: `loginSystem` (connection string oxirida)

## 7. Database Initsializatsiya

Terminal da quyidagi buyruqni bajaring:

```bash
npm run init-db
```

Bu buyruq:
- ✅ MongoDB ga ulanadi
- ✅ Default foydalanuvchi yaratadi (Sardor / Sardor_developer)
- ✅ Kerakli indexlarni yaratadi
- ✅ Collections ni sozlaydi

## 8. Vercel Environment Variables

Vercel da deploy qilish uchun:

1. **Vercel Dashboard** ga kiring
2. **Project Settings → Environment Variables** ga o'ting
3. Quyidagi o'zgaruvchilarni qo'shing:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://...` (yuqoridagi connection string) |
| `JWT_SECRET` | `your-super-secret-jwt-key` |
| `NODE_ENV` | `production` |

4. **Save** tugmasini bosing
5. **Redeploy** qiling

## 9. Netlify Environment Variables

Netlify da deploy qilish uchun:

1. **Netlify Dashboard** ga kiring
2. **Site Settings → Environment Variables** ga o'ting
3. Yuqoridagi o'zgaruvchilarni qo'shing
4. **Save** va **Redeploy**

## 10. Test Qilish

1. **Local test:**
   ```bash
   npm run init-db
   npm start
   ```

2. **Production test:**
   - Vercel/Netlify URL ga kiring
   - Register sahifasida yangi foydalanuvchi yarating
   - Login qiling

## Xavfsizlik Maslahatlari

⚠️ **MUHIM:**
- `.env.local` faylini GitHub ga yuklaMang!
- `.gitignore` da `.env.local` borligini tekshiring
- Production da IP whitelist ishlatish tavsiya etiladi
- Parollarni hech qachon kodda yozmang
- JWT_SECRET ni tasodifiy va murakkab qiling

## Muammolar va Yechimlar

### Xato: "MongoServerError: bad auth"
- Username va parolni tekshiring
- Connection string da `<password>` ni o'z parolingiz bilan almashtirganingizni tekshiring

### Xato: "MongoNetworkError: connection timeout"
- Network Access da IP manzil qo'shilganini tekshiring
- Internet ulanishini tekshiring

### Xato: "MONGODB_URI environment variable yo'qolgan"
- `.env.local` fayl yaratilganini tekshiring
- Vercel/Netlify da environment variables qo'shilganini tekshiring

## Qo'shimcha Ma'lumot

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Node.js Driver Docs:** https://mongodb.github.io/node-mongodb-native/
- **Vercel Environment Variables:** https://vercel.com/docs/environment-variables
