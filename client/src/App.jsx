import { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage';
import EmailPage from './pages/EmailPage';
import CalendarPage from './pages/CalendarPage';
import ProjectsPage from './pages/ProjectsPage';
import AutomationPage from './pages/AutomationPage';
import PredictionsPage from './pages/PredictionsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'email':
        return <EmailPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'automation':
        return <AutomationPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'email', label: 'Email' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'projects', label: 'Projects' },
    { id: 'automation', label: 'Automation' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold">Command Center Dashboard</h1>
        <p className="text-sm text-blue-100">Unified Email, Calendar, Projects & Automation</p>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="flex flex-wrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-4 py-3 font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 border-b-2 border-blue-300'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center p-4 text-xs">
        <p>Command Center v0.1.0 | Powered by Express + React + SQLite</p>
      </footer>
    </div>
  );
}
