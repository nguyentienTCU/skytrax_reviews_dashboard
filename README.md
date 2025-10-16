# Skytrax Reviews Dashboard

[**Live Website →** https://skytrax-reviews-dashboard.vercel.app/](https://skytrax-reviews-dashboard.vercel.app/)

Skytrax Reviews Dashboard is an interactive analytics platform that visualizes **125,000+ airline passenger reviews** from Skytrax. It provides real-time insights into customer satisfaction, ratings, and sentiment across different airlines.  
The project features a **Next.js + TypeScript frontend** and an **Express.js backend** that connects **directly to Snowflake** for live query execution.

---

## 🧠 Tech Stack

- **Frontend:** Next.js, TypeScript, Recharts, Tailwind CSS  
- **Backend:** Express.js, Node.js  
- **Database:** Snowflake (real-time queries)  
- **Deployment:** Vercel (frontend) & Node server (backend)

---

## 🚀 Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/nguyentienTCU/skytrax_reviews_dashboard.git

# 2. Run frontend
cd frontend
npm install
npm run dev

# 3. Run backend
cd ../backend
npm install
npm run dev