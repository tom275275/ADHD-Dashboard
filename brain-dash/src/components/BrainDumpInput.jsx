import { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function BrainDumpInput({ onTasksParsed, userToken }) {
  const [brainDump, setBrainDump] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const textAreaRef = useRef();

  const {
    isListening,
    startListening,
    stopListening,
    isSupported,
    transcript
  } = useSpeechRecognition();

  // Update brain dump when speech recognition provides transcript
  useEffect(() => {
    if (transcript) {
      setBrainDump(prev => {
        const newValue = prev ? `${prev} ${transcript}` : transcript;
        // Focus textarea after voice input
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
        return newValue;
      });
    }
  }, [transcript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brainDump.trim()) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ brainDump: brainDump.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tasks to database
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({ tasks: data.tasks }),
        });

        onTasksParsed(data.tasks);
      } else {
        setError(data.error || 'Failed to process your brain dump');
      }
    } catch (err) {
      console.error('Error processing brain dump:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="brain-dump-input">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            ref={textAreaRef}
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="Dump everything on your mind here... 

Examples:
• I need to finish the TPS report for Friday it's super important
• Call mom back sometime this week
• Organize my desktop files
• Reply to that important email from Sarah
• Schedule car oil change"
            className="brain-dump-textarea"
            rows={8}
            disabled={isProcessing}
          />

          {isSupported && (
            <button
              type="button"
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              disabled={isProcessing}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isListening && (
          <div className="listening-indicator">
            🎤 Listening... Speak your tasks out loud
          </div>
        )}

        <button
          type="submit"
          className="organize-button"
          disabled={!brainDump.trim() || isProcessing}
        >
          {isProcessing ? (
            <span>
              🧠 Processing your brain dump...
            </span>
          ) : (
            <span>
              ✨ Organize My Brain
            </span>
          )}
        </button>
      </form>

      <div className="input-tips">
        <p>💡 <strong>Tips:</strong> Just write naturally! Mention deadlines (Friday, tomorrow), importance levels (urgent, important), or any context that helps.</p>
        {isSupported && (
          <p>🎤 <strong>Voice:</strong> Click the microphone to speak your tasks instead of typing.</p>
        )}
      </div>
    </div>
  );
}