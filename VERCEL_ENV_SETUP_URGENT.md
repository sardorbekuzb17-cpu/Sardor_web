# ⚠️ MUHIM: Vercel Environment Variables

## Server bilan bog'lanish xatosi sababi:
Vercel da MongoDB connection string yo'q!

## ✅ Hal qilish yo'li:

### 1. Vercel Dashboard ga kiring:
https://vercel.com/dashboard

### 2. Loyihangizni toping:
`sardor-web` yoki sizning loyiha nomi

### 3. Settings → Environment Variables ga kiring

### 4. Quyidagi 3ta variable qo'shing:

**Variable 1:**
- Name: `MONGODB_URI`
- Value: `mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0`
- Environment: Production, Preview, Development (hammasini belgilang)

**Variable 2:**
- Name: `JWT_SECRET`
- Value: `kiro-secure-jwt-secret-key-2024-sardor-developer-12345`
- Environment: Production, Preview, Development (hammasini belgilang)

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`
- Environment: Production, Preview, Development (hammasini belgilang)

### 5. Save qiling

### 6. Redeploy qiling:
- Deployments → Latest Deployment → ... (3 nuqta) → Redeploy

## Yoki tezkor yo'l:

Vercel CLI orqali:
```bash
vercel env add MONGODB_URI
# Keyin value ni kiriting

vercel env add JWT_SECRET
# Keyin value ni kiriting

vercel env add NODE_ENV
# production deb kiriting
```

Keyin:
```bash
vercel --prod
```

## Tekshirish:
1-2 daqiqadan keyin saytni yangilang va qayta kirish urinib ko'ring.
