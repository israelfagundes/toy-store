# 🧸 Toy Store Dashboard

A modern, responsive toy store dashboard application built with React, TypeScript, and Tailwind CSS. This project provides a comprehensive interface for managing customer data and sales analytics.

<img width="2500" height="1325" alt="Screenshot 2025-07-20 025431" src="https://github.com/user-attachments/assets/7d2efc2f-3805-4ec9-b030-c41ffb4a080b" />

## ✨ Features

- **Customer Management**: View and manage customer information
- **Sales Analytics**: Track sales data with interactive charts and visualizations
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI Components**: Built with Shadcn/ui and Radix UI primitives
- **Data Visualization**: Interactive charts powered by Recharts
- **Form Handling**: Form validation with React Hook Form and Zod
- **State Management**: Efficient state management with Zustand
- **Data Tables**: Advanced table functionality with TanStack Table

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Mock API**: JSON Server
- **Code Quality**: Biome (linting & formatting)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/israelfagundes/toy-store.git
   cd toy-store
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Start the mock API server** (in a separate terminal)
   ```bash
   npx json-server db.json --port 3001
   ```

The application will be available at `http://localhost:5173` and the API at `http://localhost:3001`.

## 🚀 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the project for production
- `pnpm preview` - Preview the production build

## 📁 Project Structure

```
toy-store/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── stores/           # Zustand stores
├── db.json               # Mock database for JSON Server
├── components.json       # Shadcn/ui configuration
├── biome.json           # Biome configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🎯 Key Features

### Customer Management

- View customer personal information
- Track customer purchase history
- Sales analytics per customer
- Customer data validation and form handling

### Dashboard Analytics

- Sales performance charts
- Customer statistics
- Revenue tracking
- Interactive data visualizations

### Modern UI/UX

- Clean, intuitive interface
- Responsive design for all devices
- Smooth animations and transitions

## 🔧 Configuration

### Environment Setup

The project uses Vite for development and build processes. Configuration files:

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `biome.json` - Code formatting and linting
- `components.json` - Shadcn/ui component configuration

### Mock Data

The project includes a `db.json` file with sample customer data for development. The JSON Server provides a REST API for testing the application.

## 👨‍💻 Author

**Israel Fagundes**

- GitHub: [@israelfagundes](https://github.com/israelfagundes)

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for the accessible component primitives
- [TanStack](https://tanstack.com/) for the powerful data management tools

---
