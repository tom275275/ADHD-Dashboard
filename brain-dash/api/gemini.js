import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    verifyToken(req);

    const { brainDump } = req.body;

    if (!brainDump || typeof brainDump !== 'string') {
      return res.status(400).json({ error: 'Brain dump text required' });
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a task parsing AI for Brain Dash, an energy-aware task manager. Parse the following brain dump into individual tasks and categorize each task into ONE of these four categories based on urgency and energy requirements:

1. **Do It Now** (Urgent & High Energy): Critical tasks requiring significant mental effort with deadlines
2. **Focus** (Urgent & Low Energy): Important tasks that are less demanding but still time-sensitive  
3. **Productive Procrastination** (Not Urgent & High Energy): Useful tasks that aren't time-sensitive, good for high energy moments
4. **Easy Wins** (Not Urgent & Low Energy): Simple, low-effort tasks that still feel productive

For each task you identify, return it in this exact JSON format:
{
  "content": "The task description",
  "category": "Do It Now" | "Focus" | "Productive Procrastination" | "Easy Wins",
  "urgency": "urgent" | "not_urgent", 
  "energy_level": "high" | "low"
}

IMPORTANT RULES:
- Extract individual, actionable tasks from the brain dump
- Be decisive about categorization - pick the BEST fit category for each task
- Look for deadline keywords (today, tomorrow, Friday, etc.) to identify urgency
- Consider mental effort required (writing reports = high energy, making calls = low energy)
- Return ONLY a JSON array of task objects, no other text
- If no clear tasks are found, return an empty array []

Brain Dump: "${brainDump}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Parse the AI response as JSON
      const tasks = JSON.parse(text);
      
      // Validate the response format
      if (!Array.isArray(tasks)) {
        throw new Error('Response is not an array');
      }

      // Validate each task object
      const validatedTasks = tasks.filter(task => {
        return task.content && 
               task.category && 
               task.urgency && 
               task.energy_level &&
               ['Do It Now', 'Focus', 'Productive Procrastination', 'Easy Wins'].includes(task.category) &&
               ['urgent', 'not_urgent'].includes(task.urgency) &&
               ['high', 'low'].includes(task.energy_level);
      });

      return res.status(200).json({ tasks: validatedTasks });

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        debug: process.env.NODE_ENV === 'development' ? text : undefined
      });
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    
    if (error.message === 'No valid token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}