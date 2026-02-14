# 🏘️ Ramaul Village Portal

A modern, comprehensive community management web application designed for village-level governance and citizen engagement in **Siraha, Nepal**.

## 📖 Overview

The **Ramaul Village Portal** serves as a digital platform connecting village administrators, ward representatives, and community members. It enables transparent governance, budget tracking, event management, and active citizen participation, bringing digital transformation to local administration.

## ✨ Core Features

-  **Budget Transparency** : Visual breakdown of village financial planning and spending with interactive charts.
- **Business Directory**: A digital directory for village shops and services to support the local economy.
- **Citizen Charter**: Comprehensive "How-To" guide for administrative tasks and public services.
- **Election Dashboard**:  candidate details of 2081 election, and vote share visualizations for local elections.
- **Ward Administration**: Profiles of elected leaders, official notices, and document repository for public records.
- **Community Engagement**: Threaded discussion forums and a civic issue tracking system for reporting local problems.
- **Events & News**: Stay updated with upcoming village events (with registration) and the latest local news.
- **Emergency Services**: Quick access to critical emergency contacts and services.
- **Admin Dashboard**: Full-featured CMS for administrators to manage content, inquiries, and analytics.
- **Bilingual Support**: Seamlessly switch between **English** and **नेपाली** (Nepali).

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State & Backend**: [Supabase](https://supabase.com/) (Auth, Database, Realtime, Storage)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) + [Lenis](https://github.com/darkroomengineering/lenis)
- **Charts**: [Recharts](https://recharts.org/)
- **i18n**: [i18next](https://www.i18next.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```sh
   git clone <YOUR_GIT_URL>
   cd ramaul
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```

## 🏗️ Development

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the source code.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs unit tests using Vitest.

---
More to add 
<p align="center">
  <sub>Managed by the Ramaul Village Administration</sub>
</p>
