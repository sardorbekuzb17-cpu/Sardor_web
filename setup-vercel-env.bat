@echo off
echo ========================================
echo Vercel Environment Variables Setup
echo ========================================
echo.

echo Installing Vercel CLI...
npm install -g vercel
echo.

echo Logging in to Vercel...
vercel login
echo.

echo Adding Environment Variables...
echo.

echo Adding MONGODB_URI...
echo mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true^&w=majority^&appName=Cluster0 | vercel env add MONGODB_URI production
echo mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true^&w=majority^&appName=Cluster0 | vercel env add MONGODB_URI preview
echo mongodb+srv://sardor_admin:Sardo9050r@cluster0.157rccv.mongodb.net/loginSystem?retryWrites=true^&w=majority^&appName=Cluster0 | vercel env add MONGODB_URI development
echo.

echo Adding JWT_SECRET...
echo kiro-secure-jwt-secret-key-2024-sardor-developer-12345 | vercel env add JWT_SECRET production
echo kiro-secure-jwt-secret-key-2024-sardor-developer-12345 | vercel env add JWT_SECRET preview
echo kiro-secure-jwt-secret-key-2024-sardor-developer-12345 | vercel env add JWT_SECRET development
echo.

echo Adding NODE_ENV...
echo production | vercel env add NODE_ENV production
echo production | vercel env add NODE_ENV preview
echo production | vercel env add NODE_ENV development
echo.

echo ========================================
echo Environment variables qo'shildi!
echo ========================================
echo.

echo Deploying to Vercel...
vercel --prod
echo.

echo ========================================
echo Tayyor! Saytingiz ishga tushdi!
echo ========================================
pause
