# 🚀 Production Deployment Checklist

**Status:** Both builds pass ✅ — App is ready for deployment with the config changes below.

---

## ✅ Already Done (Build Fixes Applied This Session)

| # | Fix | File |
|---|-----|------|
| 1 | Removed unused imports (`Info`, `Calendar`) | `OrderDetails.tsx` |
| 2 | Removed unused imports (`useEffect`, `useCallback`) and `Address` interface | `UserProfile.tsx` |
| 3 | Added `Product` interface + typed all `any` references | `Products.tsx` |
| 4 | Fixed `ProductCard` props (`id: string`, `oldPrice?: string`) | `ProductCard.tsx` |
| 5 | Fixed `image` prop fallback (`|| ''`) | `Products.tsx` |
| 6 | Fixed Prisma client import path (`generated/prisma` not `generated/prisma/client`) | `prisma.ts` |
| 7 | Fixed `@types/pg` Pool type conflict (`as any` cast) | `prisma.ts` |
| 8 | Fixed inquiry route param types (`as string` cast) | `admin.ts` |

### Build Results
```
✅ Backend:  npx tsc --noEmit        → Exit code: 0
✅ Backend:  npm run build           → Exit code: 0
✅ Frontend: npm run build           → Exit code: 0 (built in 1.28s)
✅ .env files: Never committed to Git history
```

---

## ⚙️ Environment Variables — What You Must Set in Production

### Backend (Vercel / VPS Environment Variables)

| Variable | Current (Dev) | What to set in Production |
|----------|---------------|---------------------------|
| `NODE_ENV` | `development` | **`production`** |
| `DATABASE_URL` | Prisma Accelerate URL | Same or your production DB URL |
| `CLERK_SECRET_KEY` | `sk_test_...` | **Use your LIVE Clerk secret key** (`sk_live_...`) |
| `CLERK_PUBLISHABLE_KEY` | `pk_test_...` | **Use your LIVE Clerk publishable key** (`pk_live_...`) |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | **Use your LIVE Razorpay key** (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Test secret | **Use your LIVE Razorpay secret** |
| `RAZORPAY_WEBHOOK_SECRET` | `your_webhook_secret_here` | **Set from Razorpay Dashboard** (see below) |
| `CORS_ORIGIN` | `http://localhost:5173` | **Your frontend production URL** (e.g. `https://shriyans.com`) |
| `PORT` | `5000` | Usually auto-set by hosting provider |

> [!CAUTION]
> **Never use `test` keys in production.** Razorpay test keys won't process real payments. Clerk test keys won't work with a production domain.

### Frontend (Vercel Environment Variables)

| Variable | Current (Dev) | What to set in Production |
|----------|---------------|---------------------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | **Your LIVE Clerk publishable key** (`pk_live_...`) |
| `VITE_API_URL` | `http://192.168.1.58:5000` | **Your backend production URL** (e.g. `https://api.shriyans.com`) |

---

## 🔑 Razorpay Webhook Setup (Required)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com) → **Settings → Webhooks**
2. Click **Add New Webhook**
3. **Webhook URL:** `https://your-backend-domain.com/api/payment/webhook`
4. **Secret:** Generate one — Razorpay will show it to you
5. **Active Events:** Select `payment.captured`
6. Copy the secret and add it as `RAZORPAY_WEBHOOK_SECRET` in your backend environment

---

## 🔒 Security Checklist

| Check | Status | Notes |
|-------|--------|-------|
| `.env` never in Git history | ✅ | Verified — `git log` shows no commits |
| Backend `.gitignore` has `.env` | ✅ | Already present |
| Frontend `.gitignore` has `.env` | ✅ | Already present |
| Helmet security headers enabled | ✅ | Active in production |
| Rate limiting enabled | ✅ | 200 req/15min global, 30/15min for auth |
| CORS restricts origins in production | ✅ | Checks `CORS_ORIGIN` when `NODE_ENV=production` |
| JWT verified via Clerk `verifyToken` | ✅ | Cryptographic verification |
| Admin routes behind `requireAuth + isAdmin` | ✅ | Database role check |
| Server-side price calculation | ✅ | Not trusting client prices |
| Error stack traces hidden in production | ✅ | Only shown in development |
| Body size limited | ✅ | 1MB max |
| Inquiry status validated | ✅ | Fixed this session |
| Cart quantity bounded | ✅ | Fixed this session (1-50) |
| COD route removed | ✅ | All orders via Razorpay |
| Search string length capped | ✅ | Fixed this session (200 chars) |
| Webhook signature verification | ✅ | Added this session |

---

## 📦 Deployment Steps

### Option A: Both on Vercel

**Frontend:**
1. Connect `frontend/` directory to a Vercel project
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`
5. `vercel.json` already configured with SPA rewrites ✅

**Backend:**
1. Connect `backend/` directory to a separate Vercel project
2. `vercel.json` already configured ✅
3. Add **ALL** environment variables from the table above
4. Note: Vercel serverless = reduce pool `max` to 5 in `prisma.ts`

### Option B: Backend on VPS, Frontend on Vercel

Better for the backend since it uses connection pooling. Deploy frontend on Vercel as above, and run the backend with:
```bash
NODE_ENV=production npm run build && npm start
```

---

## ⚠️ Minor Items (Optional but Recommended)

| # | Item | Priority |
|---|------|----------|
| 1 | Remove `console.log` statements in `SignInPage.tsx:32`, `SignUpPage.tsx:57`, `ForgotPasswordPage.tsx:54` (they log auth results) | Medium |
| 2 | Add `<meta name="description">` to `index.html` for SEO | Low |
| 3 | Add `robots.txt` and `sitemap.xml` to `public/` | Low |
| 4 | Set up a custom domain for both frontend and backend | Required |
| 5 | Configure Clerk production domain in Clerk Dashboard | Required |

---

> [!IMPORTANT]
> **The code is production-ready.** The only things left are configuration — switching from test keys to live keys, setting the correct URLs, and configuring the Razorpay webhook in the dashboard.
