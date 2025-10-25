import React, { useState, useEffect, useCallback } from 'react';
import { useReminders } from './hooks/useReminders';
import type { Medicine, Log } from './types';
import Dashboard from './components/Dashboard';
import WeeklyReport from './components/WeeklyReport';
import AlarmModal from './components/AlarmModal';
import LoginPage from './components/LoginPage'; // Import the new LoginPage
import { getMockLogs, getMockMedicines } from './services/mockApi';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>(getMockMedicines());
  const [logs, setLogs] = useState<Log[]>(getMockLogs());
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);
  const [view, setView] = useState<'dashboard' | 'report'>('dashboard');

  const handleReminder = useCallback((medicine: Medicine) => {
    setActiveMedicine(medicine);
  }, []);

  useReminders(medicines, handleReminder);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addMedicine = (med: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = { ...med, id: Date.now().toString() };
    setMedicines(prev => [...prev, newMed]);
  };

  const addLog = (medicineId: string) => {
    const newLog: Log = {
      id: Date.now().toString(),
      medicineId,
      timestamp: new Date(),
      status: 'taken',
    };
    setLogs(prev => [...prev, newLog]);
    setActiveMedicine(null);
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const NavButton: React.FC<{
    currentView: 'dashboard' | 'report';
    targetView: 'dashboard' | 'report';
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ currentView, targetView, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
        currentView === targetView
          ? 'bg-blue-600 text-white'
          : 'bg-white text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Smart Medicine Reminder
          </h1>
          <nav className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
            <NavButton currentView={view} targetView='dashboard' onClick={() => setView('dashboard')}>
              Dashboard
            </NavButton>
            <NavButton currentView={view} targetView='report' onClick={() => setView('report')}>
              Weekly Report
            </NavButton>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? (
          <Dashboard medicines={medicines} addMedicine={addMedicine} />
        ) : (
          <WeeklyReport logs={logs} medicines={medicines} />
        )}
      </main>

      {activeMedicine && (
        <AlarmModal
          medicine={activeMedicine}
          onAcknowledge={() => addLog(activeMedicine.id)}
          onClose={() => setActiveMedicine(null)}
        />
      )}
    </div>
  );
};

export default App;