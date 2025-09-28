# Modern Portfolio Website

[![CI/CD Pipeline](https://github.com/username/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/username/portfolio/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/username/portfolio/branch/main/graph/badge.svg)](https://codecov.io/gh/username/portfolio)
[![Lighthouse Score](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://github.com/username/portfolio)

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features dual-track presentation for Project Management and Development expertise with comprehensive testing, accessibility, and performance optimization. Includes a secure admin panel for easy content management.

## ✨ Features

### 🎯 Core Features
- **Dual-Track Portfolio**: Switch between Project Manager and Developer presentations
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Admin Panel**: Secure content management system for all portfolio sections
- **Performance Optimized**: Lighthouse score 95+ across all metrics
- **Accessibility First**: WCAG 2.1 AA compliant
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

### 🛠️ Technical Features
- **TypeScript**: Full type safety with strict configuration
- **Firebase Integration**: Authentication, Firestore database, and Storage for the admin panel
- **Testing**: Comprehensive unit and E2E testing with 80%+ coverage
- **CI/CD**: Automated testing, security scanning, and deployment
- **Code Quality**: ESLint, Prettier, and pre-commit hooks
- **Performance Monitoring**: Lighthouse CI integration
- **Security**: Vulnerability scanning and security headers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for admin panel functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/username/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up Firebase configuration
# Create a .env file based on .env.example with your Firebase credentials

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

The admin panel can be accessed at `http://localhost:5173/admin`

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm run test         # Run unit tests in watch mode
npm run test:run     # Run unit tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run E2E tests
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── About.tsx       # About section
│   ├── Experience.tsx  # Experience timeline
│   ├── Projects.tsx    # Projects showcase
│   ├── Skills.tsx      # Skills matrix
│   ├── Certifications.tsx # Certifications
│   ├── Testimonials.tsx   # Client testimonials
│   ├── Contact.tsx     # Contact form
│   └── ui/             # Reusable UI components
├── admin/              # Admin panel components
│   ├── auth/           # Authentication components
│   ├── context/        # Context providers
│   ├── sections/       # Section editors
│   └── services/       # Data services
├── test/               # Test utilities and setup
│   ├── setup.ts       # Test configuration
│   └── utils.tsx      # Test helpers
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
├── index.css          # Global styles
└── vite-env.d.ts      # Vite type definitions

e2e/                   # End-to-end tests
├── portfolio.spec.ts  # Main E2E test suite

config files:
├── vitest.config.ts   # Vitest configuration
├── playwright.config.ts # Playwright configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
├── eslint.config.js   # ESLint configuration
├── .prettierrc        # Prettier configuration
└── vite.config.ts     # Vite configuration
```

## 🧪 Testing Strategy

### Unit Testing
- **Framework**: Vitest + React Testing Library
- **Coverage**: 80%+ target across all metrics
- **Scope**: Component logic, user interactions, accessibility

### E2E Testing
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Scope**: User journeys, responsive design, performance

### Testing Best Practices
- Test user behavior, not implementation details
- Accessibility testing with screen readers
- Visual regression testing
- Performance testing with Lighthouse

## 🎨 Design System

### Color Palette
- **Primary**: Gray scale (50-900)
- **Accent**: Blue for interactive elements
- **Semantic**: Green (success), Red (error), Yellow (warning)

### Typography
- **Font**: System font stack for optimal performance
- **Scale**: Tailwind's default type scale
- **Hierarchy**: Semantic heading structure (h1-h6)

### Components
- **Buttons**: Primary, secondary, and ghost variants
- **Cards**: Consistent spacing and shadows
- **Forms**: Accessible with proper validation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Progressive enhancement
- Touch-friendly interactions
- Optimized performance on mobile devices

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

### Testing
- Automated accessibility testing with axe-core
- Manual testing with screen readers
- Keyboard navigation testing

## 🚀 Performance

### Optimization Techniques
- Code splitting with React.lazy
- Image optimization
- Bundle analysis and optimization
- Lazy loading for non-critical content
- Service worker for caching

### Metrics Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms
- **Lighthouse Score**: 95+

## 🔍 SEO Features

### Meta Tags
- **Dynamic Meta Tags**: Title, description, and keywords based on site settings
- **Open Graph Protocol**: Enhanced social media sharing with og:title, og:description, og:image
- **Twitter Cards**: Twitter-specific meta tags for improved sharing experience
- **Canonical URLs**: Prevent duplicate content issues
- **Mobile Viewport**: Optimized for mobile devices

### Structured Data
- **JSON-LD Implementation**: Schema.org markup for better search engine understanding
- **Person Schema**: Personal information structured for search engines
- **WebSite Schema**: Website information for search engines
- **CreativeWork Schema**: Project information structured for search engines

### Technical SEO
- **Sitemap Generation**: Automatically generated sitemap.xml during build
- **Robots.txt**: Proper crawl instructions for search engines
- **Core Web Vitals Optimization**: Scripts for analyzing and improving performance metrics
- **Image Optimization**: Automatic image optimization for faster loading
- **Semantic HTML**: Proper use of HTML5 semantic elements

### SEO Tools & Scripts
- **generate:sitemap**: Generates a sitemap.xml file
- **analyze:web-vitals**: Analyzes Core Web Vitals metrics
- **optimize:images**: Optimizes images for better performance

## 🔒 Security

### Security Measures
- Content Security Policy (CSP)
- Security headers
- Dependency vulnerability scanning
- HTTPS enforcement
- Input sanitization

### CI/CD Security
- Automated security audits
- Trivy vulnerability scanning
- SARIF report generation
- Security-focused code review

## 🚀 Deployment

### GitHub Pages
Automatic deployment on push to main branch:

1. Tests pass ✅
2. Security scan passes ✅
3. Build succeeds ✅
4. Deploy to GitHub Pages 🚀

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write tests for new features
- Follow conventional commit messages
- Maintain accessibility standards

### Pre-commit Hooks
- ESLint fixes
- Prettier formatting
- Type checking
- Test execution

## 📊 Project Metrics

- **Lines of Code**: ~2,000
- **Test Coverage**: 80%+
- **Lighthouse Score**: 95+
- **Bundle Size**: < 500KB
- **Dependencies**: Minimal and well-maintained

## 🛣️ Roadmap

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed implementation roadmap and progress tracking.

### Upcoming Features
- [x] Admin panel for content management
- [ ] Dark/Light theme toggle
- [ ] Blog section with CMS integration
- [ ] Advanced animations with Framer Motion
- [ ] PWA features (offline support)
- [ ] Internationalization (i18n)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Firebase](https://firebase.google.com/) - Authentication, Database, and Storage
- [React Router](https://reactrouter.com/) - Routing
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework
- [Playwright](https://playwright.dev/) - E2E testing
- [Lucide React](https://lucide.dev/) - Icons

---

**Built with ❤️ by [Your Name]**