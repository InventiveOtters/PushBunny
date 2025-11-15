# 🐰 PushBunny Dashboard

Modern, beautiful dashboard for PushBunny analytics with smooth animations and dark mode design.

## ✨ Features

- 🎨 **Premium Dark Design** - Beautiful dark mode UI with `#02001A` background
- ⚡ **Smooth Animations** - Framer Motion powered transitions
- 📊 **Rich Analytics** - Interactive charts and variant performance metrics
- 🔐 **Secure Login** - Protected routes with API key authentication
- 📱 **Responsive** - Works perfectly on all screen sizes
- 🚀 **Fast & Snappy** - Built with Vite for instant HMR

## 🎯 Pages

### Landing Page
- Hero section with animated typing effect
- **Notification Showcase** - Interactive phone mockup with slot-machine word rotation
- Feature highlights
- Navigation to dashboard

### Login
- Simple authentication flow
- Connects to `/v1/auth/login` backend endpoint
- Stores API key securely

### Dashboard
- **Intent Tabs** - Switch between different notification intents
- **Stats Cards** - Total sent, opened, clicked, and CTR
- **Performance Charts** - Bar and line charts for visualization
- **Variants Table** - Detailed view of all message variants
- **Real-time Metrics** - Open rate and click-through rate per variant

## 🚀 Quick Start

### Install Dependencies

```bash
cd dashboard
npm install
```

### Configure Backend URL

```bash
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL
```

### Run Development Server

```bash
npm run dev
```

The dashboard will be available at http://localhost:3000

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **TailwindCSS** - Utility-first CSS
- **Recharts** - Chart visualization
- **Lucide React** - Beautiful icons

## 🎨 Design System

### Colors

```js
Primary Background: #02001A
Primary Light: #0A0828
Primary Lighter: #1A1640

Accent Purple: #8B5CF6
Accent Blue: #3B82F6
Accent Pink: #EC4899
Accent Green: #10B981
```

### Components

- **Glass Effect** - Frosted glass morphism
- **Gradient Text** - Multi-color gradient text
- **Hover Effects** - Smooth scale and color transitions
- **Loading States** - Elegant loading animations

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx       # Landing page
│   │   ├── Login.jsx         # Login flow
│   │   └── Dashboard.jsx     # Main dashboard
│   ├── components/
│   │   └── NotificationShowcase.jsx  # Slot machine demo
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication state
│   ├── services/
│   │   └── api.js            # Backend API calls
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/
│   ├── logo.png              # Logo image
│   └── pushbunny.riv         # Rive animation
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔌 Backend Integration

The dashboard connects to your FastAPI backend:

- **POST `/v1/auth/login`** - Authentication
- **GET `/v1/variants/{intent_id}`** - Fetch variants for an intent

Make sure your backend is running on the URL specified in `.env`

## 🎯 Usage

1. Start the backend: `cd backend && docker-compose up`
2. Start the dashboard: `cd dashboard && npm run dev`
3. Open http://localhost:3000
4. Click "Dashboard" in nav or "Get Started"
5. Login with any email/password (for demo)
6. View analytics for your notification variants

## 🚀 Deployment

### Build

```bash
npm run build
```

Output will be in `dist/` folder.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Set `VITE_API_URL` in your deployment platform to point to your production backend.

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#02001A',  // Your color
    light: '#0A0828',
    lighter: '#1A1640',
  },
  // ...
}
```

### Add New Charts

Use Recharts components in `Dashboard.jsx`:

```jsx
import { PieChart, Pie } from 'recharts'

// Add to dashboard
```

### Modify Animations

Edit Framer Motion props:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

## 📊 Dashboard Features Breakdown

### Statistics Cards
- Total notifications sent
- Total opens
- Total clicks  
- Overall click-through rate

### Charts
- **Bar Chart** - Sent, opened, clicked per variant
- **Line Chart** - Open rate and CTR trends

### Variants Table
- Message text
- Send count
- Open count
- Click count
- Open rate percentage
- CTR percentage
- Color-coded performance indicators

## 🐛 Troubleshooting

### Backend Connection Failed
- Check backend is running on correct port
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in backend

### No Data Showing
- Ensure backend has data (run seed script)
- Check browser console for errors
- Verify API key is valid

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf .vite`

## 📝 License

Part of the PushBunny project.

---

**Built with ❤️ for the hackathon** 🐰
