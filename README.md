# Restaurant POS with AI Voice Ordering 🍔

An ongoing project exploring modern restaurant management and AI-powered ordering experiences, built with **Next.js, Supabase, and voice AI integration**.

The goal is to bring together a customer-facing digital menu, an administrative dashboard, and an AI-powered voice ordering assistant into one application.

This project is actively under development, with new features, improvements, and refinements being introduced as development progresses.

## 🚀 Live Preview

**[Visit the application](https://restaurant-with-ai.netlify.app/)**

*Note: The deployed version may not always reflect the latest development changes.*

## ✨ Project Features

### 🛒 Customer Experience
- Browse the restaurant menu and explore available products.
- View product descriptions, prices, and images.
- Filter products by category.
- Responsive interface for desktop and mobile devices.
- AI-powered assistant concept for a more interactive ordering experience.

### 🤖 AI Voice Ordering
- Voice-based interaction with an AI ordering assistant.
- Conversational menu navigation.
- Exploring ways to make the ordering process more natural and intuitive.

### 📊 Admin Dashboard
- Dedicated administrative interface.
- Manage menu products and categories.
- Add and edit product information.
- Manage product availability.
- Role-based access and authentication.

### 🗄️ Backend & Database
- Supabase PostgreSQL for application data.
- Supabase Storage for product images.
- Supabase authentication for user management.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive design |
| Supabase | Database, authentication, and storage |
| Lucide React | Icons |
| AI & Voice Integration | Conversational ordering experience |

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd restaurant_with_ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Add any additional environment variables required by the AI and voice integrations.

**Important:** Never commit `.env.local` or expose your Supabase service role key in client-side code.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```text
restaurant_with_ai/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js application routes
│   ├── components/      # Reusable UI components
│   ├── lib/             # Shared utilities and configuration
│   └── services/        # Data fetching and application services
├── package.json
└── package-lock.json
```

## 🌐 Deployment

A live preview is available on Netlify:

**[https://restaurant-with-ai.netlify.app/](https://restaurant-with-ai.netlify.app/)**

## 🔧 Development Status

This project is currently a work in progress.

Development is ongoing, with additional functionality, UI refinements, backend improvements, and AI integration planned and being implemented.

The current version represents an evolving stage of the application rather than its final release.

---

**Built with Next.js, Supabase, and AI.**
