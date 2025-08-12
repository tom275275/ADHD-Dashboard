export default function EnergySelector({ currentEnergy, onEnergyChange }) {
  const energyLevels = [
    { id: 'high', emoji: '🧠⚡', label: 'High Energy', description: 'Ready to tackle big tasks' },
    { id: 'low', emoji: '🧠💤', label: 'Low Energy', description: 'Need something lighter' },
    { id: 'focused', emoji: '🎯', label: 'Focused', description: 'In the zone, but selective' },
    { id: 'distracted', emoji: '🦋', label: 'Distracted', description: 'Mind is wandering' },
  ];

  return (
    <div className="energy-selector">
      <h3>How's your energy right now?</h3>
      <p className="energy-subtitle">Optional, but helps me highlight the right tasks for you</p>
      
      <div className="energy-options">
        {energyLevels.map((energy) => (
          <button
            key={energy.id}
            className={`energy-option ${currentEnergy === energy.id ? 'selected' : ''}`}
            onClick={() => onEnergyChange(currentEnergy === energy.id ? '' : energy.id)}
          >
            <span className="energy-emoji">{energy.emoji}</span>
            <span className="energy-label">{energy.label}</span>
            <span className="energy-description">{energy.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}