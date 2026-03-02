# DT Solars Uganda - Customer Website

A modern, responsive solar energy solutions website built with React, TypeScript, and Vite. This is the customer-facing branch of the DT Solars project.

## 🚀 Features

- 🌞 Solar product catalog with detailed specifications
- 📱 Responsive design for all devices
- 🔋 Product categories: Solar Kits, Batteries & Inverters, CCTV Cameras, Water Pumps
- ⭐ Customer reviews and ratings
- 📍 Branch locator with Google Maps integration
- 💬 Live chat support
- 🎁 Promotions and special offers
- 📦 Pre-order functionality
- 🔍 Product search and filtering

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS with custom animations
- **UI Components**: Radix UI primitives
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Maps**: Leaflet for branch locations
- **Charts**: Recharts for analytics
- **PWA**: Service Worker with workbox

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mozemedia5/dtsolarsug.git
cd dtsolarsug

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your Firebase credentials
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these values from your Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the configuration values

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment to Vercel

### Prerequisites
1. [Vercel Account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) (optional)

### Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository (`mozemedia5/dtsolarsug`)

2. **Configure Branch**
   - Select `main` branch for production deployment
   - Or select `admin` branch for admin dashboard deployment

3. **Add Environment Variables**
   - In the "Environment Variables" section, add all Firebase credentials:
     ```
     `
   - Select which environments to apply to: Production, Preview, or Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Setting Environment Variables via CLI

```bash
# Set environment variables for production
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production

# Pull environment variables to local
vercel env pull
```

## 🔐 Firebase Configuration

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /reviews/{reviewId} {
      allow read: if resource.data.verified == true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
dtsolarsug/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── shared/       # Shared components (Header, Footer, etc.)
│   │   └── ui/           # UI primitives (Button, Card, etc.)
│   ├── data/             # Static data files
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and services
│   │   ├── firebase.ts   # Firebase configuration
│   │   └── firebaseService.ts  # Firebase data services
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── dist/                 # Production build output
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
└── package.json          # Project dependencies and scripts
```

## 🌐 Live Demo

- **Customer Website**: [https://dtsolarsug.vercel.app](https://dtsolarsug.vercel.app) (after deployment)
- **Admin Dashboard**: Deploy the `admin` branch separately

## 📝 Admin Dashboard

This repository has two main branches:
- `main`: Customer-facing website (this branch)
- `admin`: Admin dashboard for managing products, promotions, and reviews

To work with the admin dashboard:
```bash
git checkout admin
npm install
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@dt-solars.com or contact us through the website.

## 🙏 Acknowledgments

- Firebase for backend services
- Vercel for hosting
- Radix UI for accessible components
- TailwindCSS for styling utilities
