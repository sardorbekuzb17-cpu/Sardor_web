# 🚨 TEZKOR YEChIM - Server xatosini tuzatish

## Muammo:
"Server bilan bog'lanishda xatolik" - Vercel da MongoDB connection yo'q

## ✅ 3 DAQIQADA TUZATISH:

### QADAM 1: Vercel Dashboard ga kiring
1. Brauzerda oching: https://vercel.com
2. Login qiling (GitHub orqali)

### QADAM 2: Loyihangizni toping
1. Dashboard da `sardor-web` loyihasini toping
2. Ustiga bosing

### QADAM 3: Settings ga kiring
1. Yuqorida "Settings" tugmasini bosing
2. Chap tarafda "Environment Variables" ni toping va bosing

### QADAM 4: 3ta variable qo'shing

#### Variable 1 - MONGODB_URI:
- "Add New" tugmasini bosing
- **Name:** `MONGODB_URI`
- **Value:** 
```
mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true&w=majority&appName=Cluster0
```
- **Environments:** Production, Preview, Development (3tasini ham belgilang ✅)
- "Save" bosing

#### Variable 2 - JWT_SECRET:
- Yana "Add New" tugmasini bosing
- **Name:** `JWT_SECRET`
- **Value:** `kiro-secure-jwt-secret-key-2024-sardor-developer-12345`
- **Environments:** Production, Preview, Development (3tasini ham belgilang ✅)
- "Save" bosing

#### Variable 3 - NODE_ENV:
- Yana "Add New" tugmasini bosing
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environments:** Production, Preview, Development (3tasini ham belgilang ✅)
- "Save" bosing

### QADAM 5: Redeploy qiling
1. Yuqorida "Deployments" ga o'ting
2. Eng yuqoridagi (latest) deployment ni toping
3. O'ng tarafda 3 nuqta (...) tugmasini bosing
4. "Redeploy" ni tanlang
5. "Redeploy" tugmasini yana bir marta bosing (tasdiqlash uchun)

### QADAM 6: Kutish
- 1-2 daqiqa kuting
- Deployment "Ready" bo'lguncha kuting

### QADAM 7: Tekshirish
- Saytingizni yangilang: https://sardor-web.vercel.app/site1.html
- Login qilib ko'ring

## ✅ Tayyor!

Agar yana xatolik bo'lsa, menga yozing!

---

## Yoki tezkor yo'l - CMD orqali:

Terminal ochib quyidagi buyruqni bajaring:
```bash
setup-vercel-env.bat
```

Bu avtomatik hammasi qiladi!
