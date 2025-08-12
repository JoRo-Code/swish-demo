# Swish Play Buddy - Frontend Application

A modern React-based frontend application for the Swish Play Buddy payment system. This application provides a beautiful, responsive user interface for sending money, managing transactions, and interacting with the Swish microservices ecosystem.

## 🏗️ Architecture Overview

Swish Play Buddy is the frontend component of a polyglot microservices architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  User Service   │    │ Payment Service │    │Transaction Svc  │
│   (This App)    │    │   (Node.js)     │    │     (Go)        │    │   (Python)      │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 3002    │    │   Port: 3003    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         └───────────────────────┼───────────────────────┼───────────────────────┘
                                 │                       │
                          HTTP REST APIs            HTTP REST APIs
```

This React application communicates with the backend microservices to provide:
- **User Authentication & Management** - Login, registration, profile management
- **Money Transfer** - Send money to contacts with real-time validation
- **Transaction History** - View and track all payment activities
- **Contact Management** - Store and manage recipient information
- **Balance Tracking** - Real-time account balance updates

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **bun** package manager

### Development Setup

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun run preview
```

## 🔧 Configuration

### Service Endpoints

The frontend is configured to communicate with these microservices:

- **User Service**: http://localhost:3001
- **Payment Service**: http://localhost:3002
- **Transaction Service**: http://localhost:3003

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_PAYMENT_SERVICE_URL=http://localhost:3002
VITE_TRANSACTION_SERVICE_URL=http://localhost:3003
```

### Test Credentials

```
Phone: +46701234567
Password: password123
```

## 🛠️ Technology Stack

This frontend is built with modern web technologies:

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zod** - Schema validation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BalanceCard.tsx # Account balance display
│   ├── ContactList.tsx # Contact management
│   ├── SendMoneyForm.tsx # Money transfer form
│   └── TransactionItem.tsx # Transaction display
├── contexts/            # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx  # Mobile detection
│   └── use-toast.ts    # Toast notifications
├── lib/                 # Utility functions
│   ├── mockData.ts     # Mock data for development
│   └── utils.ts        # Helper functions
├── pages/               # Application pages
│   ├── Index.tsx       # Main dashboard
│   ├── Login.tsx       # Authentication
│   └── NotFound.tsx    # 404 page
├── services/            # API service layer
│   ├── api.ts          # Base API configuration
│   ├── transactionService.ts # Transaction operations
│   └── userService.ts  # User operations
└── main.tsx            # Application entry point
```

## 🔄 Development Workflow

### Starting Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
# Hot reload is enabled for instant feedback
```

### Making Changes

1. **Components**: Edit files in `src/components/`
2. **Pages**: Modify files in `src/pages/`
3. **Services**: Update API calls in `src/services/`
4. **Styling**: Modify `src/App.css` or use Tailwind classes

### Testing

```bash
# Run tests (if configured)
npm test

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 🎨 UI Components

### Available Components

- **BalanceCard** - Displays current account balance with beautiful styling
- **ContactList** - Manages recipient contacts with search and filtering
- **SendMoneyForm** - Secure money transfer form with validation
- **TransactionItem** - Individual transaction display with status indicators

### Design System

The application uses a consistent design system based on:
- **Color Palette**: Professional financial app colors
- **Typography**: Clear, readable fonts for financial data
- **Spacing**: Consistent spacing using Tailwind's scale
- **Components**: Reusable UI components from shadcn/ui

## 🔌 API Integration

### Service Communication

The frontend communicates with microservices through:

- **REST APIs** - Standard HTTP endpoints
- **Real-time Updates** - Polling for balance and transaction updates
- **Error Handling** - Graceful fallbacks and user-friendly error messages
- **Loading States** - Smooth user experience during API calls

### Data Flow

1. **User Authentication** → User Service
2. **Balance Queries** → User Service
3. **Money Transfers** → Payment Service
4. **Transaction History** → Transaction Service
5. **Contact Management** → User Service

## 🐛 Troubleshooting

### Common Issues

**Frontend not loading**
```bash
# Check if port 5173 is available
lsof -i :5173

# Try different port
npm run dev -- --port 8080
```

**API connection errors**
```bash
# Verify microservices are running
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

**Build errors**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Development Tips

- Use the browser's developer tools to debug API calls
- Check the Network tab for failed requests
- Use React DevTools for component debugging
- Monitor the console for error messages

## 🚀 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# The build output will be in the `dist/` directory
```

### Deployment Options

- **Static Hosting** - Deploy the `dist/` folder to any static host
- **CDN** - Serve through a content delivery network
- **Container** - Dockerize the application
- **Platform Services** - Deploy to Vercel, Netlify, or similar

## 🤝 Contributing

When contributing to the frontend:

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Update component documentation
4. Test changes across different screen sizes
5. Ensure accessibility standards are met

## 📝 License

This frontend application is part of the Swish Play Buddy project and follows the same licensing terms.
