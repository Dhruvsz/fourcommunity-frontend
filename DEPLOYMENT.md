# 🚀 FourCommunity Frontend Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Required
```env
VITE_API_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://your-frontend-domain.com
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 2. Backend Requirements
- Backend must be running and accessible at `VITE_API_URL`
- Backend must have `/create-payment` endpoint
- CORS must allow your frontend domain
- Razorpay webhook must be configured

## 🌐 Vercel Deployment

### Quick Deploy
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import `fourcommunity-frontend` repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   ```bash
   # In Vercel Dashboard > Project > Settings > Environment Variables
   VITE_API_URL=https://your-backend.railway.app
   VITE_SUPABASE_URL=https://jjmjlofgkbvnnfudkpit.supabase.co
   VITE_SUPABASE_ANON_KEY=your_key_here
   VITE_SITE_URL=https://your-app.vercel.app
   VITE_RAZORPAY_KEY_ID=rzp_live_your_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Automatic deployments on every push to main

### Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update `VITE_SITE_URL` to match your domain

## 🌍 Netlify Deployment

### Quick Deploy
1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select `fourcommunity-frontend`

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables (same as Vercel list above)

4. **Deploy**
   - Click "Deploy site"
   - Automatic deployments on every push

### Netlify-Specific Configuration
Create `netlify.toml` in root (already included):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Manual Server Deployment

### Using PM2 (Production Server)
```bash
# Clone repository
git clone https://github.com/Dhruvsz/fourcommunity-frontend.git
cd fourcommunity-frontend

# Install dependencies
npm install

# Create production environment file
cp .env.example .env
# Edit .env with your production values

# Build for production
npm run build

# Serve with PM2
npm install -g pm2
pm2 serve dist 3000 --name "fourcommunity-frontend"
pm2 startup
pm2 save
```

### Using Nginx (Reverse Proxy)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/fourcommunity-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

## 🔒 Security Configuration

### CORS Setup (Backend)
Ensure your backend allows your frontend domain:
```javascript
// In your backend
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://your-app.vercel.app',
    'http://localhost:5173' // for development
  ]
}));
```

### Environment Security
- ✅ All environment variables are prefixed with `VITE_`
- ✅ No sensitive keys exposed to frontend
- ✅ Service role keys remain on backend only

## 🧪 Testing Deployment

### 1. Build Test (Local)
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

### 2. Production Checklist
- [ ] Homepage loads correctly
- [ ] Community discovery works
- [ ] Payment flow initiates (test with test keys)
- [ ] Authentication works
- [ ] All environment variables loaded
- [ ] No console errors
- [ ] Mobile responsive

### 3. Payment Flow Test
1. Navigate to a paid community
2. Click "Pay & Join"
3. Verify Razorpay checkout opens
4. Complete test payment
5. Verify membership granted

## 🚨 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Loading**
- Ensure variables are prefixed with `VITE_`
- Restart development server after adding variables
- Check deployment platform environment settings

**CORS Errors**
- Verify backend CORS configuration
- Check `VITE_API_URL` matches backend URL exactly
- Ensure no trailing slashes in URLs

**Payment Not Working**
- Verify `VITE_RAZORPAY_KEY_ID` is correct
- Check backend `/create-payment` endpoint
- Verify webhook configuration

### Debug Mode
Add to `.env` for debugging:
```env
VITE_DEBUG=true
```

## 📊 Monitoring

### Performance
- Use Vercel Analytics or Netlify Analytics
- Monitor Core Web Vitals
- Check bundle size with `npm run build`

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

## 🔄 Updates

### Deployment Pipeline
1. Make changes locally
2. Test with `npm run dev`
3. Build test with `npm run build`
4. Push to main branch
5. Automatic deployment triggers

### Rollback Strategy
- Vercel: Use deployment history to rollback
- Netlify: Use deploy history to rollback
- Manual: Keep previous build in separate directory

---

## 🎯 Production URLs

After deployment, update these in your systems:
- **Frontend URL**: `https://your-app.vercel.app`
- **Backend URL**: `https://your-backend.railway.app`
- **Webhook URL**: `https://your-backend.railway.app/webhook`

## 📞 Support

For deployment issues:
1. Check build logs in deployment platform
2. Verify all environment variables
3. Test locally with production build
4. Check backend connectivity

**Remember**: The payment flow is frozen - do not modify core payment logic during deployment!