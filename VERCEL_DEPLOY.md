# 🚀 Vercel ga Deploy Qilish

## 1-usul: Vercel CLI (Terminal)

### O'rnatish:
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### Deploy:
```bash
vercel
```

Keyin:
- Project name: `sardor-web`
- Deploy qiling!

---

## 2-usul: GitHub orqali (Eng oson)

### Qadamlar:

1. **Vercel ga kiring:**
   - https://vercel.com/
   - GitHub bilan login qiling

2. **Yangi loyiha qo'shing:**
   - "Add New" > "Project" ni bosing
   - GitHub repository ni tanlang: `Sardor_web`

3. **Sozlamalar:**
   - Framework Preset: `Other`
   - Build Command: `npm install`
   - Output Directory: `.`
   - Install Command: `npm install`

4. **Deploy qiling:**
   - "Deploy" tugmasini bosing
   - 2-3 daqiqada tayyor!

---

## 3-usul: Vercel Dashboard (Drag & Drop)

1. https://vercel.com/new ga o'ting
2. "Import Git Repository" ni tanlang
3. GitHub repository ni ulang

---

## ⚙️ Environment Variables

Vercel dashboard da:
1. Project Settings > Environment Variables
2. Quyidagilarni qo'shing:
   - `NODE_ENV`: `production`

---

## 🌐 Custom Domain

1. Vercel dashboard > Domains
2. "Add" ni bosing
3. Domeningizni kiriting
4. DNS sozlamalarini yangilang

---

## 📝 Vercel Xususiyatlari

✅ **Avtomatik Deploy:**
- GitHub ga push qilsangiz avtomatik deploy bo'ladi

✅ **Serverless Functions:**
- `/api` papkadagi fayllar avtomatik API ga aylanadi

✅ **Global CDN:**
- Butun dunyoda tez ishlaydi

✅ **HTTPS:**
- Avtomatik SSL sertifikat

✅ **Analytics:**
- Built-in analytics

---

## 🔗 URL lar

Deploy qilingandan keyin:
- **Production:** `https://sardor-web.vercel.app`
- **Custom Domain:** `https://your-domain.com`

---

## 🛠️ Troubleshooting

Agar muammo bo'lsa:
1. `vercel logs` - loglarni ko'ring
2. Vercel dashboard > Deployments > Logs
3. `vercel dev` - local test qiling

---

## 📊 Monitoring

Vercel dashboard da:
- Analytics
- Function logs
- Deploy history
- Performance metrics

---

**Vercel Netlify dan tezroq va osonroq! 🚀**
