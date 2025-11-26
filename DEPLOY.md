# 🚀 Netlify ga Deploy Qilish

## 1-usul: GitHub orqali (Tavsiya etiladi)

### Qadamlar:

1. **GitHub repository yarating:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```

2. **Netlify ga kiring:**
   - https://app.netlify.com/ ga o'ting
   - "Add new site" > "Import an existing project" ni bosing
   - GitHub ni tanlang va repository ni ulang

3. **Build sozlamalari:**
   - Build command: `npm install`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

4. **Deploy qiling:**
   - "Deploy site" ni bosing
   - 2-3 daqiqada saytingiz tayyor bo'ladi!

## 2-usul: Netlify CLI orqali

### O'rnatish:
```bash
npm install -g netlify-cli
```

### Login:
```bash
netlify login
```

### Deploy:
```bash
netlify deploy --prod
```

## 3-usul: Drag & Drop

1. Netlify ga kiring: https://app.netlify.com/
2. "Sites" > "Add new site" > "Deploy manually"
3. Barcha fayllarni (node_modules dan tashqari) drag & drop qiling

## ⚙️ Environment Variables

Netlify dashboard da:
1. Site settings > Environment variables ga o'ting
2. Quyidagilarni qo'shing:
   - `NODE_VERSION`: `18`

## 🔒 Custom Domain

1. Netlify dashboard > Domain settings
2. "Add custom domain" ni bosing
3. DNS sozlamalarini yangilang

## ✅ Tekshirish

Deploy qilingandan keyin:
- CAPTCHA ishlashini tekshiring
- Login/logout funksiyalarini sinab ko'ring
- Barcha xavfsizlik xususiyatlarini test qiling

## 📝 Demo Foydalanuvchilar

- **Admin:** username: `admin`, parol: `Admin@123`
- **User:** username: `user`, parol: `User@123`

## 🛡️ Production Sozlamalari

1. **HTTPS:** Netlify avtomatik HTTPS beradi
2. **CDN:** Global CDN orqali tez yuklash
3. **Serverless Functions:** Avtomatik scale bo'ladi
4. **DDoS Protection:** Netlify tomonidan himoyalangan

## 🔄 Avtomatik Deploy

GitHub ga push qilganingizda avtomatik deploy bo'ladi:
```bash
git add .
git commit -m "Yangilanish"
git push
```

## 📊 Monitoring

Netlify dashboard da:
- Analytics
- Function logs
- Deploy history
- Performance metrics

## 💡 Maslahatlar

1. Custom domain ulang (professional ko'rinish uchun)
2. Environment variables ishlatib, maxfiy ma'lumotlarni himoyalang
3. Deploy preview ishlatib, o'zgarishlarni test qiling
4. Netlify Forms qo'shib, feedback oling

## 🆘 Muammolar

Agar muammo bo'lsa:
1. Netlify function logs ni tekshiring
2. Browser console ni tekshiring
3. `netlify dev` bilan local test qiling
4. Netlify support ga murojaat qiling

---

**Saytingiz 24/7 ishlaydi va global CDN orqali tez yuklaydi! 🎉**
