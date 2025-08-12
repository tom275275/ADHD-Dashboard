import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BrainDumpInput from './BrainDumpInput';
import TaskLists from './TaskLists';
import EnergySelector from './EnergySelector';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentEnergy, setCurrentEnergy] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleTasksParsed = (parsedTasks) => {
    setTasks(parsedTasks);
    setShowResults(true);
  };

  const handleNewBrainDump = () => {
    setShowResults(false);
    setTasks([]);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">🧠⚡ Brain Dash</h1>
          <div className="user-controls">
            <span className="welcome">Hey {user.username}!</span>
            <button onClick={logout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {!showResults ? (
          <div className="brain-dump-section">
            <div className="intro-text">
              <h2>Organize Your Brain 🧠</h2>
              <p>Dump all your tasks below. I'll sort them by urgency and energy level.</p>
            </div>

            <EnergySelector 
              currentEnergy={currentEnergy}
              onEnergyChange={setCurrentEnergy}
            />

            <BrainDumpInput 
              onTasksParsed={handleTasksParsed}
              userToken={user.token}
            />
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h2>Your Organized Tasks ✨</h2>
              <button 
                onClick={handleNewBrainDump}
                className="new-dump-button"
              >
                New Brain Dump
              </button>
            </div>

            <TaskLists 
              tasks={tasks}
              currentEnergy={currentEnergy}
              userToken={user.token}
            />
          </div>
        )}
      </main>
    </div>
  );
}