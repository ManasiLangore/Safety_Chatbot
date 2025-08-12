import readlineSync from 'readline-sync';
import OpenAI from 'openai';
import fs from 'fs';

// Initialize OpenAI client with ChatAnywhere API
const client = new OpenAI({
  apiKey: "sk-L7FvwDe89Css9a1XhUWPklDFzJk4cn3umMsRlREAD2d6XKRZ",
  baseURL: "https://api.chatanywhere.org/v1"
});

const HISTORY_FILE = 'chatHistory.json';

// Predefined Q&A
const predefinedQA = {
  "women safety number": `🛡️ **Emergency Numbers:**\n\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Police:** 100\n• **Ambulance:** 108\n\nStay safe! 🤝`,
  "safety tips": `🛡️ **Essential Safety Tips:**\n\n• **Trust your instincts:** If something feels wrong, leave immediately\n• **Stay aware:** Keep your head up and observe your surroundings\n• **Share location:** Tell trusted contacts where you're going\n• **Avoid isolation:** Stay in well-lit, populated areas\n• **Keep emergency numbers:** Have them easily accessible\n• **Vary your routine:** Don't be predictable in your patterns\n\nNeed tips for a **specific situation**? 🤝`,
  "send sos": `🛡️ **SOS Methods:**\n\n• **Emergency Call:** Dial 112 immediately\n• **Phone Features:** Use emergency SOS (press power button 5 times)\n• **Apps:** Use safety apps with panic buttons\n• **Location Sharing:** Send live location to trusted contacts\n• **Voice Commands:** "Hey Google/Siri, call emergency"\n\nYour safety is **priority number one**! 🤝`,
  "emergency": `🛡️ **Emergency Response:**\n\n• **Call 112:** India's universal emergency number\n• **Stay visible:** Move to a public, well-lit area\n• **Share location:** Send your location to trusted contacts\n• **Stay calm:** Speak clearly to emergency services\n• **Don't hang up:** Stay on the line until help arrives\n• **Document:** If safe, record details for later\n\n**Help is on the way!** 🤝`
};

const policeStationsData = {
    "pune": [
        {
            name: "Loni Kalbhor Police Station",
            address: "Main Road, near Sadana Sahakari Bank, Pune–Solapur Road, Loni Kalbhor – 412201",
            phone: "020-2691 3260",
            area: "Loni Kalbhor",
            distance: "0.5 km"
        },
        {
            name: "Lonikalbhor Police Station", 
            address: "Loni Kalbhor Gaon, Loni Kalbhor – 412201",
            phone: "020-2691 3260",
            area: "Loni Kalbhor",
            distance: "1.2 km"
        },
        {
            name: "Fursungi Police Station",
            address: "Bhekrai Nagar, Fursungi, Pune – 412308",
            phone: "020-2691 4500",
            area: "Fursungi", 
            distance: "5.7 km"
        },
        {
            name: "Hadapsar Police Station",
            address: "Hadapsar, Pune – 411028",
            phone: "020-2691 3031",
            area: "Hadapsar",
            distance: "8.2 km"
        },
        {
            name: "Wanowrie Police Station",
            address: "Wanowrie, Pune – 411040",
            phone: "020-2686 1947", 
            area: "Wanowrie",
            distance: "12.1 km"
        }
    ]
};

// History Management Functions
function initializeHistoryFile() {
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    console.log('📝 Created new chat history file.');
  }
}

function readHistory() {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading history file:', error.message);
    return [];
  }
}

function saveHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('❌ Error saving history:', error.message);
  }
}

function addToHistory(userMessage, botReply) {
  const history = readHistory();
  const newEntry = {
    time: new Date().toLocaleString(),
    user: userMessage,
    bot: botReply
  };
  history.push(newEntry);
  saveHistory(history);
}

function viewHistory() {
  const history = readHistory();
  
  if (history.length === 0) {
    console.log('\n📝 No chat history found.\n');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📜 CHAT HISTORY');
  console.log('='.repeat(60));

  history.forEach((entry, index) => {
    console.log(`\n🕒 ${entry.time}`);
    console.log(`👤 You: ${entry.user}`);
    console.log(`🛡️ Sathi: ${entry.bot.replace(/🛡️|🤝/g, '').trim()}`);
    
    if (index < history.length - 1) {
      console.log('-'.repeat(40));
    }
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
}

function showRecentChats(count = 5) {
  const history = readHistory();
  
  if (history.length === 0) {
    console.log('💬 No previous chats found. Starting fresh!\n');
    return;
  }

  const recentChats = history.slice(-count);
  console.log('\n' + '='.repeat(50));
  console.log(`📚 LAST ${Math.min(count, history.length)} CHAT${history.length > 1 ? 'S' : ''}`);
  console.log('='.repeat(50));

  recentChats.forEach((entry, index) => {
    console.log(`\n🕒 ${entry.time}`);
    console.log(`👤 You: ${entry.user}`);
    console.log(`🛡️ Sathi: ${entry.bot.replace(/🛡️|🤝/g, '').trim()}`);
    
    if (index < recentChats.length - 1) {
      console.log('-'.repeat(30));
    }
  });
  
  console.log('\n' + '='.repeat(50) + '\n');
}

// Check predefined answers
function checkPredefinedAnswer(input) {
  const lowerInput = input.toLowerCase();
  for (const [key, answer] of Object.entries(predefinedQA)) {
    if (lowerInput.includes(key)) return answer;
  }
  return null;
}

// Format AI response
function formatResponseText(text) {
  text = text.replace(/🛡️|🤝/g, '').trim();
  let sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const importantWords = [
    'emergency', 'safety', 'help', 'call', 'police', 'trust', 'aware', 'avoid',
    'stay', 'keep', 'share', 'location', 'immediately', 'never', 'always',
    'important', 'remember', 'warning', 'danger', 'safe', 'secure', 'dial', 'number'
  ];

  let bulletPoints = sentences.map(sentence => {
    sentence = sentence.trim();
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      sentence = sentence.replace(regex, (match) => `**${match}**`);
    });
    return `• ${sentence}`;
  });

  return `🛡️ ${bulletPoints.join('\n')}\n\nNeed more help? 🤝`;
}

// Chat with AI
async function Chatting(input) {
  const predefinedAnswer = checkPredefinedAnswer(input);
  if (predefinedAnswer) {
    console.log(predefinedAnswer);
    // Save predefined answers to history too
    addToHistory(input, predefinedAnswer);
    return;
  }

  try {
    console.log("🤔 Thinking...");

    const contextualInput = `You are a women's safety assistant. Answer clearly in bullet points. User: ${input}`;
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful women's safety assistant." },
        { role: "user", content: contextualInput }
      ]
    });

    const botReply = completion.choices[0].message.content;
    const formattedReply = formatResponseText(botReply);
    console.log(formattedReply);

    // Save to history
    addToHistory(input, formattedReply);

  } catch (error) {
    const errorMsg = `❌ Error: ${error.message}`;
    console.log(errorMsg);
    addToHistory(input, errorMsg);
  }
}

// Display main menu
function showMenu() {
  console.log('╭─────────────────────────────╮');
  console.log('│    🛡️ SATHI SAFETY BOT 🤝   │');
  console.log('├─────────────────────────────┤');
  console.log('│ 1. Start new chat           │');
  console.log('│ 2. View chat history        │');
  console.log('│ 3. Exit                     │');
  console.log('╰─────────────────────────────╯');
}

// Start new chat session
async function startNewChat() {
  console.log('\n💬 Starting new chat session...');
  console.log('Ask me safety-related questions anytime.');
  console.log('Type "menu" to return to the main menu.\n');

  while (true) {
    const input = readlineSync.question("Ask me anything--> ");
    
    if (input.toLowerCase() === "menu") {
      console.log('📝 Returning to main menu...\n');
      break;
    }

    if (input.trim() === '') {
      console.log('Please enter a message.\n');
      continue;
    }

    await Chatting(input);
    console.log();
  }
}

// Main application
async function main() {
  // Initialize history file
  initializeHistoryFile();
  
  console.log("🛡️ Hello! I'm Sathi, your personal safety assistant. 🤝");
  
  // Show recent chats on startup
  showRecentChats(5);

  while (true) {
    showMenu();
    const choice = readlineSync.question('\nEnter your choice (1-3): ');

    switch (choice) {
      case '1':
        await startNewChat();
        break;
      
      case '2':
        viewHistory();
        readlineSync.question('Press Enter to continue...');
        console.log('');
        break;
      
      case '3':
        console.log('👋 Goodbye! Stay safe!');
        process.exit(0);
        break;
      
      default:
        console.log('❌ Invalid choice. Please enter 1, 2, or 3.\n');
        break;
    }
  }
}

// Error handling for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye! Stay safe!');
  process.exit(0);
});

// Start the application
main().catch(error => {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
});