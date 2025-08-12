export default function TaskList({ 
  category, 
  tasks, 
  emoji, 
  description, 
  color, 
  isHighlighted,
  taskCount,
  completedTasks,
  onTaskComplete 
}) {
  
  if (tasks.length === 0) {
    return (
      <div className={`task-list empty ${isHighlighted ? 'highlighted' : ''}`}>
        <div className="list-header">
          <h3>
            <span className="list-emoji">{emoji}</span>
            {category}
          </h3>
          <span className="task-count">0</span>
        </div>
        <p className="list-description">{description}</p>
        <div className="empty-state">
          <span className="empty-emoji">🎉</span>
          <p>Nothing here! Your brain is clear in this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-list ${color} ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="list-header">
        <h3>
          <span className="list-emoji">{emoji}</span>
          {category}
        </h3>
        <span className="task-count">{taskCount}</span>
      </div>
      
      <p className="list-description">{description}</p>

      <ul className="task-items">
        {tasks.map((task, index) => {
          const taskId = `${category}-${index}`;
          const isCompleted = completedTasks.has(taskId);
          
          return (
            <li 
              key={taskId}
              className={`task-item ${isCompleted ? 'completed' : ''}`}
            >
              <button
                className="task-checkbox"
                onClick={() => onTaskComplete(taskId, category)}
                disabled={isCompleted}
                title={isCompleted ? 'Task completed!' : 'Mark as done'}
              >
                {isCompleted ? '✅' : '⭕'}
              </button>
              
              <span className="task-content">
                {task.content}
              </span>
              
              <div className="task-meta">
                <span className={`urgency-badge ${task.urgency}`}>
                  {task.urgency === 'urgent' ? '🔴' : '🟡'}
                </span>
                <span className={`energy-badge ${task.energy_level}`}>
                  {task.energy_level === 'high' ? '⚡' : '💤'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {isHighlighted && (
        <div className="highlight-badge">
          ✨ Matches your energy
        </div>
      )}
    </div>
  );
}