# 🔧 Vercel 404 Xatosini Tuzatish

## Muammo:
Vercel `public` papkani ko'rmayapti.

## ✅ Yechim (2 daqiqa):

### 1. Vercel Dashboard ga kiring:
https://vercel.com/sardor/sardor-web/settings/general

### 2. Build & Development Settings:

**Framework Preset:** Other

**Build Command:** (bo'sh qoldiring)

**Output Directory:** `public` ⬅️ MUHIM!

**Install Command:** `npm install`

### 3. Save tugmasini bosing

### 4. Redeploy:
- **Deployments** bo'limiga o'ting
- Oxirgi deployment ni toping
- **⋯** (3 nuqta) → **Redeploy** tugmasini bosing

### 5. 2-3 daqiqa kuting

### 6. Test qiling:
https://sardor-web.vercel.app

---

## Yoki vercel.json orqali:

Agar yuqoridagi usul ishlamasa, `vercel.json` ga qo'shing:

```json
{
    "buildCommand": "echo 'No build needed'",
    "outputDirectory": "public"
}
```

Keyin:
```bash
git add vercel.json
git commit -m "Set output directory to public"
git push origin main
```

---

## ✅ Tayyor!
Endi sayt ishlashi kerak!
