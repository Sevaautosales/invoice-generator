# Seva Auto Sales - Invoice Generator

Professional invoice management system for Seva Auto Sales with frontend and backend separation.

## 🚀 Live Demo

**Frontend (Next.js)**: Deploy to Vercel  
**Backend (Express)**: Optional - for API extensions

## 📁 Project Structure

- `frontend/`: Next.js application (User Interface)
- `backend/`: Express server (Server Side API - Optional)
- `supabase/`: Database migrations

## ✨ Features

- 📄 Professional invoice generation
- 💾 Data persistence (localStorage or Supabase)
- 📊 Financial dashboard with analytics
- 🎨 Modern, responsive UI
- 📱 Mobile-friendly with slide-in sidebar
- 🔔 Custom confirmation dialogs
- 🗑️ Delete functionality with confirmations
- 💰 INR currency formatting
- 📥 PDF export capability

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL) or localStorage (mock mode)
- **Deployment**: Vercel (Frontend), Railway/Render (Backend - optional)

## 🚀 Getting Started

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file (copy from `example.env`):
   ```bash
   cp example.env .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### Backend (Optional)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Backend runs on [http://localhost:5001](http://localhost:5001)

## 📦 Deployment

### Deploy to Vercel (Frontend)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push to GitHub
2. Import to Vercel
3. Set root directory to `frontend`
4. Add environment variables (optional)
5. Deploy!

### Environment Variables

**Frontend** (optional - runs in mock mode without these):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend** (optional):
```
PORT=5001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Database Setup (Optional)

If using Supabase instead of localStorage:

1. Create a Supabase project
2. Run the migration from `supabase/migrations/001_initial_schema.sql`
3. Add credentials to environment variables
4. Redeploy

## 🎯 Usage

1. **Create Invoice**: Fill in customer and vehicle details
2. **View Invoices**: Browse all invoices with search
3. **Financial Dashboard**: Track revenue and receivables
4. **Export PDF**: Download invoices as PDF
5. **Delete**: Remove invoices with confirmation

## 📱 Mobile Support

- Responsive design for all screen sizes
- Slide-in sidebar on mobile
- Touch-friendly interface
- Optimized for mobile browsers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary to Seva Auto Sales.

## 📧 Contact

For support or inquiries, please contact Seva Auto Sales.
