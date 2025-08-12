import { useState } from 'react';
import TaskList from './TaskList';

export default function TaskLists({ tasks, currentEnergy, userToken }) {
  const [completedTasks, setCompletedTasks] = useState(new Set());

  // Categorize tasks into the 4 quadrants
  const categorizedTasks = {
    'Do It Now': tasks.filter(task => task.category === 'Do It Now'),
    'Focus': tasks.filter(task => task.category === 'Focus'),
    'Productive Procrastination': tasks.filter(task => task.category === 'Productive Procrastination'),
    'Easy Wins': tasks.filter(task => task.category === 'Easy Wins'),
  };

  // Define which categories match each energy level
  const energyMatches = {
    'high': ['Do It Now', 'Productive Procrastination'],
    'low': ['Focus', 'Easy Wins'],
    'focused': ['Do It Now', 'Focus'],
    'distracted': ['Easy Wins', 'Productive Procrastination'],
  };

  const handleTaskComplete = async (taskId, category) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
    
    // Optionally update on server
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ taskId, updates: { completed: true } }),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getListProps = (category) => {
    const isHighlighted = currentEnergy && energyMatches[currentEnergy]?.includes(category);
    const taskCount = categorizedTasks[category].length;
    
    return {
      category,
      tasks: categorizedTasks[category],
      isHighlighted,
      taskCount,
      completedTasks,
      onTaskComplete: handleTaskComplete,
    };
  };

  return (
    <div className="task-lists">
      {currentEnergy && (
        <div className="energy-hint">
          <span className="energy-indicator">
            {currentEnergy === 'high' && '🧠⚡ High Energy'}
            {currentEnergy === 'low' && '🧠💤 Low Energy'}
            {currentEnergy === 'focused' && '🎯 Focused'}
            {currentEnergy === 'distracted' && '🦋 Distracted'}
          </span>
          <span className="hint-text">
            Highlighted lists match your current energy level
          </span>
        </div>
      )}

      <div className="quadrant-grid">
        <div className="quadrant urgent-high">
          <TaskList
            {...getListProps('Do It Now')}
            emoji="🔥"
            description="Critical tasks requiring significant mental effort"
            color="red"
          />
        </div>

        <div className="quadrant urgent-low">
          <TaskList
            {...getListProps('Focus')}
            emoji="⚡"
            description="Important but less demanding tasks"
            color="orange"
          />
        </div>

        <div className="quadrant not-urgent-high">
          <TaskList
            {...getListProps('Productive Procrastination')}
            emoji="🚀"
            description="Useful tasks for high-energy moments"
            color="blue"
          />
        </div>

        <div className="quadrant not-urgent-low">
          <TaskList
            {...getListProps('Easy Wins')}
            emoji="✅"
            description="Simple tasks that still feel productive"
            color="green"
          />
        </div>
      </div>

      <div className="task-summary">
        <div className="summary-stats">
          <span className="stat">
            <strong>{tasks.length}</strong> tasks organized
          </span>
          <span className="stat">
            <strong>{completedTasks.size}</strong> completed
          </span>
          {currentEnergy && (
            <span className="stat">
              <strong>{energyMatches[currentEnergy]?.reduce((acc, cat) => acc + categorizedTasks[cat].length, 0)}</strong> match your energy
            </span>
          )}
        </div>
      </div>
    </div>
  );
}