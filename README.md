# Smart Incentive Calculator

A minimalist, monochromatic web application for calculating sales incentives, built with Next.js, Prisma, and Supabase.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React

## Setup Instructions

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to **Project Settings > Database** and find your connection strings.
3. You will need two strings:
   - **Transaction Pooler** (Port 6543) for `DATABASE_URL`.
   - **Session Pooler** (Port 5432) for `DIRECT_URL`.

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgres://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-long-random-string-at-least-32-chars"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Push Database Schema & Seed
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the App
```bash
npm run dev
```

## Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `admin123` |
| Sales | `sales@test.com` | `sales123` |

## Core Features
- **Admin Configuration**: Manage car models and incentive slabs. Prevents unauthorized access via middleware.
- **Sales Portal**: Log car sales volume per month.
- **Real-time Calculator**: Instantly see your estimated payout based on the active incentive slab.
- **Monochromatic UI**: High-contrast, dense layout inspired by Vercel and Linear.
