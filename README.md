# Interview.io - AI-Powered Interview Platform

## Overview
Interview.io is a comprehensive web-based platform that facilitates AI-powered mock interviews and real-time interview sessions. The platform supports both interviewees and interviewers with features like resume parsing, automated field extraction, and interactive interview experiences.

## Features

### Core Features
- **User Authentication**: Secure login/signup with password reset functionality
- **Role-Based Access**: Separate interfaces for interviewees and interviewers
- **Resume Upload & Parsing**: Automatic extraction of candidate information from PDF/DOCX files
- **Smart Field Detection**: AI-powered extraction of name, email, and phone from resumes
- **Interactive Prompts**: Chatbot-style interface for collecting missing information
- **Real-time Interview Sessions**: Live interview capabilities with AI assistance
- **User Profiles**: Customizable user profiles with role management

### Resume Processing
- Support for PDF and DOCX formats
- Browser-based text extraction (no server upload required)
- Automatic field detection with regex patterns
- Interactive collection of missing fields
- Redux-based state management

## Tech Stack

### Frontend
- **React 18**: Core framework with TypeScript
- **Redux Toolkit**: State management
- **React Router v6**: Navigation and routing
- **Ant Design**: UI component library
- **PDF.js**: Browser-based PDF processing
- **Mammoth.js**: DOCX file processing

### Authentication & Security
- **Firebase Auth**: User authentication
- **Redux Persist**: Session persistence
- **Client-side Processing**: Secure resume handling

### Development Tools
- **TypeScript**: Type safety and better DX
- **Create React App**: Build tooling
- **ESLint**: Code quality
- **CSS Modules**: Scoped styling

## Installation

### Prerequisites
- Node.js 16+ and npm 8+
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-org/interview-io.git
cd interview-io
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**
```bash
npm start
```
The application will open at `http://localhost:3000`

## Project Structure

```
interview-io/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── ResumeUpload.tsx # Resume upload component
│   │   └── MissingFieldPrompt.tsx # Field collection chatbot
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── auth/            # Auth pages (login, signup, etc.)
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── IntervieweePage.tsx # Interviewee interface
│   │   └── InterviewerPage.tsx # Interviewer interface
│   ├── services/            # External service integrations
│   │   └── firebase.ts      # Firebase configuration
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   └── store.ts         # Store configuration
│   ├── utils/               # Utility functions
│   │   └── resumeParser.ts  # Resume parsing logic
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component
│   └── index.tsx            # Entry point
├── public/                  # Static assets
├── docs/                    # Documentation
└── package.json            # Dependencies and scripts
```

## Available Scripts

### Development
```bash
npm start           # Start development server
npm test            # Run test suite
npm run build       # Build for production
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

### Production
```bash
npm run build       # Create production build
npm run serve       # Serve production build locally
```

## Usage Guide

### For Interviewees

1. **Sign Up/Login**
   - Create an account with email and password
   - Verify email if required
   - Select "Interviewee" role

2. **Upload Resume**
   - Navigate to the Interview page
   - Drag and drop or browse to select PDF/DOCX file
   - Wait for automatic field extraction

3. **Complete Profile**
   - Review extracted information
   - Fill in any missing fields via the chatbot interface
   - Confirm profile details

4. **Start Interview**
   - Once profile is complete, begin the interview session
   - Respond to AI-generated questions
   - Receive real-time feedback

### For Interviewers

1. **Access Dashboard**
   - Login with interviewer credentials
   - View scheduled interviews
   - Access candidate profiles

2. **Conduct Interviews**
   - Join interview sessions
   - View candidate resumes and profiles
   - Use AI-assisted question generation
   - Provide feedback and ratings

## API Documentation

### Resume Parser API

```typescript
// Extract text from file
extractTextFromFile(file: File): Promise<string>

// Extract fields from text
extractFields(text: string): ExtractedFields

// Get missing required fields
getMissingFields(fields: ExtractedFields): string[]
```

### Redux Actions

```typescript
// Resume management
setResumeData(data: ResumeData)
setLoading(isLoading: boolean)
setError(error: string)
clearResume()

// Authentication
login(credentials: LoginCredentials)
logout()
updateProfile(profileData: ProfileData)
```

## Testing

### Unit Tests
```bash
npm test                 # Run all tests
npm test -- --coverage   # Run with coverage report
npm test -- --watch      # Run in watch mode
```

### E2E Tests
```bash
npm run test:e2e         # Run end-to-end tests
```

### Test Coverage Areas
- Component rendering
- User interactions
- Resume parsing logic
- Authentication flows
- Redux state management
- API integrations

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Other Platforms

#### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

#### Vercel
```bash
npm install -g vercel
vercel
```

#### AWS Amplify
1. Connect repository
2. Configure build settings
3. Set environment variables
4. Deploy

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow the coding standards
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
```bash
git commit -m "feat: add new feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**

### Coding Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages (conventional commits)
- Add JSDoc comments for public APIs
- Maintain test coverage above 80%

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/tooling changes

## Troubleshooting

### Common Issues

#### PDF Upload Not Working
- Ensure file is a valid PDF with text content
- Check browser console for errors
- Try a different PDF file

#### DOCX Extraction Failed
- Verify file is not corrupted
- Check file size (max 10MB recommended)
- Ensure file is not password protected

#### Authentication Errors
- Verify Firebase configuration
- Check network connection
- Clear browser cache and cookies

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Mode
Enable debug mode for detailed logging:
```javascript
localStorage.setItem('debug', 'interview-io:*');
```

## Security

### Best Practices
- All resume processing happens client-side
- No sensitive data stored in localStorage
- Firebase security rules enforced
- Input validation and sanitization
- XSS protection via React
- HTTPS enforcement in production

### Reporting Security Issues
Please report security vulnerabilities to: security@interview.io

## Performance

### Optimization Strategies
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Redux state normalization
- Memoization of expensive computations
- Service worker for offline support

### Monitoring
- React DevTools Profiler
- Redux DevTools
- Lighthouse audits
- Bundle size analysis

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Getting Help
- Check [Documentation](docs/)
- Search [Issues](https://github.com/your-org/interview-io/issues)
- Join our [Discord](https://discord.gg/interview-io)
- Email: support@interview.io

### Resources
- [User Guide](docs/USER_GUIDE.md)
- [API Documentation](docs/API.md)
- [Resume Upload Feature](docs/RESUME_UPLOAD_FEATURE.md)
- [FAQ](docs/FAQ.md)

## Acknowledgments

- React team for the amazing framework
- Firebase for authentication services
- PDF.js contributors for PDF processing
- Ant Design for UI components
- Open source community for various libraries

## Roadmap

### Q1 2025
- [ ] AI-powered interview questions
- [ ] Video interview support
- [ ] Advanced analytics dashboard
- [ ] Mobile application

### Q2 2025
- [ ] Multi-language support
- [ ] Integration with ATS systems
- [ ] Collaborative interview sessions
- [ ] Performance tracking

### Future
- [ ] VR interview environments
- [ ] Blockchain-verified credentials
- [ ] Advanced AI feedback system
- [ ] Global talent marketplace

---

**Built with ❤️ by the Interview.io Team**

For more information, visit [https://interview.io](https://interview.io)