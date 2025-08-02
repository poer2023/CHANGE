# AI Paper Writing Tool

A modern, AI-powered paper writing assistant built with React, TypeScript, and Tailwind CSS.

## Features

- **Intuitive Writing Interface**: Clean, distraction-free writing environment
- **AI Assistant**: Get help with writing, research, and editing
- **Paper Management**: Organize your papers, projects, and references
- **Templates**: Start with pre-built academic paper templates
- **Real-time Collaboration**: Work with others in real-time
- **Progress Tracking**: Monitor your writing goals and statistics
- **Export Options**: Export to various formats (PDF, Word, LaTeX)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-paper-writing-tool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes ESLint issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar, etc.)
│   └── UI/             # Basic UI components (Button, Card, Input)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # State management (Zustand stores)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.