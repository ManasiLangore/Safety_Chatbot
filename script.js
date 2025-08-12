// --- Configuration ---
const OPENAI_API_KEY = "sk-L7FvwDe89Css9a1XhUWPklDFzJk4cn3umMsRlREAD2d6XKRZ";
const OPENAI_BASE_URL = "https://api.chatanywhere.org/v1";

const systemInstructionText = `You are a helpful, supportive, and calm assistant built to help women in emergency or safety-related situations.
- If the user says "help", "danger", or "unsafe", respond with clear emergency instructions.
- Provide safety tips when asked.
- If the user mentions location, ask if they want to share it for help.
- Avoid asking for unnecessary personal information.
- Keep responses short, supportive, and clear.
- If unsure, always suggest contacting a trusted friend or dialing 112.
- Use a friendly, reassuring tone.`;

// --- POLICE STATION DATABASE ---
const policeStationsData = {
    "loni kalbhor": [
        {
            name: "Loni Kalbhor Police Station",
            address: "Main Road, near Sadana Sahakari Bank, Pune–Solapur Road, Loni Kalbhor – 412201",
            phone: "020-2691 3260",
            area: "Loni Kalbhor",
            latitude: 18.4533,
            longitude: 73.9906,
            distance: "0.5 km"
        },
        {
            name: "Lonikalbhor Police Station",
            address: "Loni Kalbhor Gaon, Loni Kalbhor – 412201", 
            phone: "020-2691 3260",
            area: "Loni Kalbhor Village",
            latitude: 18.4521,
            longitude: 73.9892,
            distance: "1.2 km"
        },
        {
            name: "Fursungi Police Station",
            address: "Bhekrai Nagar, Fursungi, Pune – 412308",
            phone: "020-2691 4500",
            area: "Fursungi",
            latitude: 18.4406,
            longitude: 73.9547,
            distance: "5.7 km"
        },
        {
            name: "Hadapsar Police Station",
            address: "Hadapsar, Pune – 411028",
            phone: "020-2691 3031", 
            area: "Hadapsar",
            latitude: 18.5089,
            longitude: 73.9260,
            distance: "8.2 km"
        },
        {
            name: "Wanowrie Police Station",
            address: "Wanowrie, Pune – 411040",
            phone: "020-2686 1947",
            area: "Wanowrie", 
            latitude: 18.4798,
            longitude: 73.8947,
            distance: "12.1 km"
        },
        {
            name: "Uruli Kanchan Police Station",
            address: "Uruli Kanchan, Pune – 412202",
            phone: "020-2691 5200",
            area: "Uruli Kanchan",
            latitude: 18.4281,
            longitude: 74.0156,
            distance: "6.8 km"
        }
    ],
    "pune": [
        {
            name: "Pune City Police Station",
            address: "Commissioner Office, Pune - 411001",
            phone: "020-26122880",
            area: "Pune City",
            latitude: 18.5196,
            longitude: 73.8553,
            distance: "2.3 km"
        },
        {
            name: "Koregaon Park Police Station",
            address: "Koregaon Park, Pune - 411001", 
            phone: "020-26051503",
            area: "Koregaon Park",
            latitude: 18.5362,
            longitude: 73.8958,
            distance: "3.7 km"
        },
        {
            name: "Deccan Police Station",
            address: "Deccan Gymkhana, Pune - 411004",
            phone: "020-25675261",
            area: "Deccan",
            latitude: 18.5089,
            longitude: 73.8278,
            distance: "4.8 km"
        },
        {
            name: "Shivajinagar Police Station",
            address: "Shivajinagar, Pune - 411005",
            phone: "020-25534975",
            area: "Shivajinagar",
            latitude: 18.5308,
            longitude: 73.8505,
            distance: "6.2 km"
        }
    ]
};

// --- POLICE STATION FUNCTIONS ---
function detectUserLocation(userInput) {
    const input = userInput.toLowerCase();
    
    // Check for specific area mentions
    if (input.includes('loni kalbhor') || input.includes('loni') || input.includes('kalbhor')) return 'loni kalbhor';
    if (input.includes('pune') && !input.includes('loni')) return 'pune';
    
    // Default to Loni Kalbhor (since user is from Loni Kalbhor area)
    return 'loni kalbhor';
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Distance in km
}

function formatPoliceStationResponse(stations, userLocation) {
    let response = `🚔 **Nearest Police Stations (${userLocation.toUpperCase()}):**\n\n`;
    
    stations.forEach((station, index) => {
        response += `**${index + 1}. ${station.name}**\n`;
        response += `📍 Address: ${station.address}\n`;
        response += `📞 Phone: ${station.phone}\n`;
        response += `📏 Distance: ${station.distance}\n`;
        response += `🗺️ Area: ${station.area}\n\n`;
    });
    
    response += `🚨 **Emergency Actions:**\n`;
    response += `• **Call directly:** Tap any phone number above\n`;
    response += `• **Emergency Dial:** 112 (Universal Emergency)\n`;
    response += `• **Police Direct:** 100\n\n`;
    response += `💡 **Tip:** Save these numbers in your contacts for quick access!`;
    
    return response;
}

function getPoliceStations(userInput) {
    const location = detectUserLocation(userInput);
    const stations = policeStationsData[location] || policeStationsData['loni kalbhor'];
    
    // Sort by distance (already pre-sorted, but can be dynamic)
    const nearestStations = stations.slice(0, 6); // Top 6 nearest for Loni Kalbhor
    
    return formatPoliceStationResponse(nearestStations, location);
}

// Predefined Q&A for quick responses (UPDATED WITH POLICE STATIONS)
const predefinedQA = {
    "women safety number": `🛡️ **Emergency Numbers:**\n\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Police:** 100\n• **Ambulance:** 108\n\nStay safe! 🤝`,
    "safety tips": `🛡️ **Essential Safety Tips:**\n\n• **Trust your instincts:** If something feels wrong, leave immediately\n• **Stay aware:** Keep your head up and observe your surroundings\n• **Share location:** Tell trusted contacts where you're going\n• **Avoid isolation:** Stay in well-lit, populated areas\n• **Keep emergency numbers:** Have them easily accessible\n• **Vary your routine:** Don't be predictable in your patterns\n\nNeed tips for a **specific situation**? 🤝`,
    "send sos": `🛡️ **SOS Methods:**\n\n• **Emergency Call:** Dial 112 immediately\n• **Phone Features:** Use emergency SOS (press power button 5 times)\n• **Apps:** Use safety apps with panic buttons\n• **Location Sharing:** Send live location to trusted contacts\n• **Voice Commands:** "Hey Google/Siri, call emergency"\n\nYour safety is **priority number one**! 🤝`,
    "emergency": `🛡️ **Emergency Response:**\n\n• **Call 112:** India's universal emergency number\n• **Stay visible:** Move to a public, well-lit area\n• **Share location:** Send your location to trusted contacts\n• **Stay calm:** Speak clearly to emergency services\n• **Don't hang up:** Stay on the line until help arrives\n• **Document:** If safe, record details for later\n\n**Help is on the way!** 🤝`,
    
    // NEW POLICE STATION RESPONSES
    "police station": getPoliceStations,
    "nearest police": getPoliceStations,
    "police near me": getPoliceStations,
    "find police": getPoliceStations,
    "police help": getPoliceStations,
    "police contact": getPoliceStations
};

// Chat history for maintaining context AND storing locally
const chatHistory = [];
let fullChatHistory = []; // Store complete chat history

// --- History Management Functions ---
function initializeChatHistory() {
    const savedHistory = localStorage.getItem('sathiChatHistory');
    if (savedHistory) {
        try {
            fullChatHistory = JSON.parse(savedHistory);
            console.log('📝 Loaded chat history from browser storage');
        } catch (error) {
            console.error('Error loading chat history:', error);
            fullChatHistory = [];
        }
    } else {
        fullChatHistory = [];
        console.log('📝 Starting with empty chat history');
    }
}

function saveChatHistory() {
    try {
        localStorage.setItem('sathiChatHistory', JSON.stringify(fullChatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

function addToFullHistory(userMessage, botReply) {
    const newEntry = {
        time: new Date().toLocaleString(),
        user: userMessage,
        bot: botReply
    };
    fullChatHistory.push(newEntry);
    saveChatHistory();
}

// --- IMPROVED CLEAR HISTORY FUNCTIONS ---
function clearAllHistory() {
    console.log("Clearing all chat history...");
    
    if (fullChatHistory.length === 0) {
        alert("📝 No history to clear!\n\nYour chat history is already empty.");
        return;
    }

    const confirmMessage = `🗑️ Clear All Chat History?\n\nThis will permanently delete all ${fullChatHistory.length} saved conversations.\n\nThis action cannot be undone.\n\nProceed?`;
    
    if (confirm(confirmMessage)) {
        // Clear the arrays
        fullChatHistory.splice(0); // Clear all elements
        chatHistory.splice(1); // Keep system message, clear the rest
        
        // Remove from localStorage
        localStorage.removeItem('sathiChatHistory');
        
        // Clear current chat UI
        const chatMessagesEl = document.getElementById('chatMessages');
        if (chatMessagesEl) {
            chatMessagesEl.innerHTML = `
                <div class="message bot">
                    <span class="bot-message-decoration left">🛡️</span>
                    <span class="message-text" style="color: #000 !important;">History Cleared Successfully! 🗑️
                    
All your previous conversations have been permanently deleted. Your privacy is protected!

I'm still here to help with any safety questions. How can I assist you today?</span>
                    <span class="bot-message-decoration right">🤝</span>
                    <span class="message-time" style="color: #666 !important;">${getCurrentTime()}</span>
                </div>
            `;
        }
        
        console.log("✅ Chat history cleared successfully");
        
        // Optional: Show success message
        setTimeout(() => {
            alert("✅ Success!\n\nAll chat history has been cleared.\nYou can start fresh conversations now.");
        }, 500);
        
    } else {
        console.log("❌ History clear cancelled by user");
    }
}

function clearCurrentChatOnly() {
    console.log("Clearing current chat session...");
    
    const chatMessagesEl = document.getElementById('chatMessages');
    if (chatMessagesEl) {
        // Save current conversation to history first
        if (chatHistory.length > 1) { // More than just system message
            const currentConversation = chatHistory.slice(1); // Skip system message
            if (currentConversation.length > 0) {
                const userMessages = currentConversation.filter(msg => msg.role === 'user');
                const botMessages = currentConversation.filter(msg => msg.role === 'assistant');
                
                if (userMessages.length > 0) {
                    addToFullHistory(
                        userMessages[userMessages.length - 1].content,
                        botMessages[botMessages.length - 1]?.content || "Conversation ended"
                    );
                }
            }
        }
        
        // Clear current chat context (keep system message)
        chatHistory.splice(1);
        
        // Clear UI and show fresh start message
        chatMessagesEl.innerHTML = `
            <div class="message bot">
                <span class="bot-message-decoration left">🛡️</span>
                <span class="message-text" style="color: #000 !important;">New Chat Started! 🔄
                
Previous conversation saved to history. How can I help you today?</span>
                <span class="bot-message-decoration right">🤝</span>
                <span class="message-time" style="color: #666 !important;">${getCurrentTime()}</span>
            </div>
        `;
        
        console.log("✅ Current chat cleared, new session started");
    }
}

function showHistoryInModal() {
    console.log("Showing history modal, total chats:", fullChatHistory.length);
    
    if (fullChatHistory.length === 0) {
        alert("📝 No chat history found yet!\n\nStart chatting to build your history.");
        return;
    }

    console.log("Current chat history:", fullChatHistory);

    try {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px; bottom: 20px;
            background: white; border: 2px solid #e91e63; border-radius: 10px;
            z-index: 1000; padding: 20px; overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
        `;

        let modalHTML = `
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e91e63; padding-bottom: 15px;">
                <h2 style="color: #e91e63; margin: 0;">📜 Chat History (${fullChatHistory.length} conversations)</h2>
                <div style="margin-top: 10px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #e91e63; color: white; border: none; 
                               padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                        ✖ Close
                    </button>
                    <button onclick="clearHistoryFromModal(this)" 
                        style="background: #f44336; color: white; border: none; 
                               padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        🗑️ Clear All History
                    </button>
                </div>
            </div>
        `;

        fullChatHistory.forEach((entry, index) => {
            modalHTML += `
                <div style="border: 1px solid #ddd; margin: 15px 0; padding: 15px; border-radius: 8px; background: #f9f9f9; position: relative;">
                    <div style="color: #666; font-size: 12px; margin-bottom: 8px;">
                        🕒 ${entry.time}
                    </div>
                    <div style="margin-bottom: 8px; word-wrap: break-word;">
                        <strong style="color: #2196F3;">👤 You:</strong> <span style="color: #000;">${entry.user}</span>
                    </div>
                    <div style="word-wrap: break-word;">
                        <strong style="color: #e91e63;">🛡️ Sathi:</strong> <span style="color: #000;">${entry.bot.replace(/\*\*/g, '')}</span>
                    </div>
                    <button onclick="deleteHistoryItem(${index}, this)" 
                        style="position: absolute; top: 10px; right: 10px; 
                               background: #ff6b6b; color: white; border: none; 
                               padding: 5px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                        🗑️
                    </button>
                </div>
            `;
        });

        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
    } catch (error) {
        console.error("Modal creation failed:", error);
        alert("📝 History loading failed. Please try again.");
    }
}

// Global functions for modal buttons
window.clearHistoryFromModal = function(button) {
    if (confirm(`🗑️ Clear All ${fullChatHistory.length} Conversations?\n\nThis action cannot be undone!`)) {
        fullChatHistory.splice(0);
        localStorage.removeItem('sathiChatHistory');
        
        // Close modal and show success
        button.closest('div[style*="position: fixed"]').remove();
        
        // Clear current chat UI too
        const chatMessagesEl = document.getElementById('chatMessages');
        if (chatMessagesEl) {
            chatMessagesEl.innerHTML = `
                <div class="message bot">
                    <span class="bot-message-decoration left">🛡️</span>
                    <span class="message-text" style="color: #000 !important;">All History Cleared! ✅
                    
Your chat history has been permanently deleted. Ready for fresh conversations!</span>
                    <span class="bot-message-decoration right">🤝</span>
                    <span class="message-time" style="color: #666 !important;">${getCurrentTime()}</span>
                </div>
            `;
        }
        
        alert("✅ All chat history cleared successfully!");
    }
};

window.deleteHistoryItem = function(index, button) {
    if (confirm(`Delete this conversation?\n\nFrom: ${fullChatHistory[index].time}`)) {
        fullChatHistory.splice(index, 1);
        saveChatHistory();
        
        // Remove the visual element
        button.parentElement.remove();
        
        // Update counter in modal title
        const modal = button.closest('div[style*="position: fixed"]');
        const titleElement = modal.querySelector('h2');
        if (titleElement) {
            titleElement.innerHTML = `📜 Chat History (${fullChatHistory.length} conversations)`;
        }
        
        // If no history left, show empty message
        if (fullChatHistory.length === 0) {
            modal.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h2 style="color: #e91e63;">📜 No Chat History</h2>
                    <p>All conversations have been deleted.</p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #e91e63; color: white; border: none; 
                               padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        Close
                    </button>
                </div>
            `;
        }
    }
};

function showRecentChatsOnStartup() {
    if (fullChatHistory.length === 0) return;

    const recentCount = Math.min(3, fullChatHistory.length);
    const recentChats = fullChatHistory.slice(-recentCount);
    
    console.log(`📚 Showing last ${recentCount} chat(s):`);
    recentChats.forEach(entry => {
        console.log(`🕒 ${entry.time} - You: ${entry.user}`);
    });
}

// --- Floating Hearts Background ---
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Random position and animation delay
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.fontSize = `${10 + Math.random() * 20}px`;
        heart.style.opacity = `${0.2 + Math.random() * 0.3}`;
        
        container.appendChild(heart);
    }
}

// Check for predefined answers AND history commands (UPDATED)
function checkPredefinedAnswer(input) {
    const lowerInput = input.toLowerCase();
    
    // ENHANCED POLICE STATION DETECTION
    const policeKeywords = ['police station', 'nearest police', 'police near me', 'find police', 
                           'police help', 'police contact', 'police number', 'police location'];
    
    for (const keyword of policeKeywords) {
        if (lowerInput.includes(keyword)) {
            return getPoliceStations(input);
        }
    }
    
    // Special history commands
    if (lowerInput.includes('history') || lowerInput.includes('previous chat')) {
        if (fullChatHistory.length === 0) {
            return "📝 **No Chat History Yet**\n\nYou haven't had any conversations with me yet. Start by asking a safety question! 🤝";
        }
        
        let historyText = `📜 **Your Safety Conversations (${fullChatHistory.length} total):**\n\n`;
        const recentChats = fullChatHistory.slice(-5); // Show last 5
        
        recentChats.forEach((entry, index) => {
            historyText += `**${index + 1}.** ${entry.time}\n`;
            historyText += `   👤 You asked: "${entry.user}"\n`;
            historyText += `   🛡️ I helped with: "${entry.bot.substring(0, 100).replace(/🛡️|🤝|\*\*/g, '')}..."\n\n`;
        });
        
        if (fullChatHistory.length > 5) {
            historyText += `💡 **Showing recent 5 of ${fullChatHistory.length} conversations**\nType "full history" to see all conversations.`;
        }
        
        return historyText;
    }
    
    // Full history command
    if (lowerInput.includes('full history') || lowerInput.includes('all history')) {
        if (fullChatHistory.length === 0) {
            return "📝 No conversations saved yet.";
        }
        showHistoryInModal();
        return "📜 **Complete History Opened**\n\nI've opened your full chat history in a popup window. You can scroll through all your previous safety conversations there. 🤝";
    }
    
    // IMPROVED Clear history commands
    if (lowerInput.includes('clear history') || lowerInput.includes('delete history') || lowerInput.includes('clear all')) {
        if (fullChatHistory.length === 0) {
            return "📝 **No History to Clear**\n\nYour chat history is already empty! 🤝";
        }
        
        // Show confirmation in chat
        return `🗑️ **Clear Chat History?**\n\nYou have ${fullChatHistory.length} saved conversations.\n\n**Options:**\n• Type "yes clear all" to delete everything\n• Use the Clear History button in the interface\n• Type "cancel" to keep your history\n\n⚠️ **Warning:** This action cannot be undone! 🤝`;
    }
    
    // Confirmation for clearing
    if (lowerInput.includes('yes clear all') || lowerInput === 'yes') {
        const historyCount = fullChatHistory.length;
        fullChatHistory.splice(0); // Clear array
        chatHistory.splice(1); // Keep system message
        localStorage.removeItem('sathiChatHistory');
        return `✅ **History Cleared Successfully!**\n\nDeleted ${historyCount} conversations. Your privacy is protected!\n\nReady for fresh conversations! 🤝`;
    }
    
    if (lowerInput.includes('cancel') && fullChatHistory.length > 0) {
        return "👍 **History Preserved**\n\nYour chat history is safe! How can I help you today? 🤝";
    }
    
    // Original predefined answers
    for (const [key, answer] of Object.entries(predefinedQA)) {
        if (lowerInput.includes(key)) {
            // Handle function responses (police stations)
            if (typeof answer === 'function') {
                return answer(input);
            }
            return answer;
        }
    }
    return null;
}

// Format response text with safety emphasis
function formatResponseText(text) {
    // Remove existing decorations
    text = text.replace(/🛡️|🤝/g, '').trim();
    
    // Important safety words to emphasize
    const importantWords = [
        'emergency', 'safety', 'help', 'call', 'police', 'trust', 'aware', 'avoid',
        'stay', 'keep', 'share', 'location', 'immediately', 'never', 'always',
        'important', 'remember', 'warning', 'danger', 'safe', 'secure', 'dial', 'number'
    ];

    // Emphasize important words
    importantWords.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        text = text.replace(regex, (match) => `**${match}**`);
    });

    return text;
}

// --- OpenAI API Interaction ---
async function ChattingWithOpenAI(userProblem) {
    // Check for predefined answers first
    const predefinedAnswer = checkPredefinedAnswer(userProblem);
    if (predefinedAnswer) {
        // Save predefined answers to history too
        addToFullHistory(userProblem, predefinedAnswer);
        return predefinedAnswer;
    }

    if (!OPENAI_API_KEY) {
        return "I'm currently unable to respond, API key is missing.";
    }

    // Add user message to chat history
    chatHistory.push({ role: 'user', content: userProblem });

    const apiUrl = `${OPENAI_BASE_URL}/chat/completions`;

    // Prepare messages with system instruction
    const messages = [
        { role: 'system', content: systemInstructionText },
        ...chatHistory
    ];

    const requestBody = {
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.8,
        max_tokens: 800
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("OpenAI API Error:", responseData);
            const errorMessage = responseData.error?.message || `API request failed with status ${response.status}`;
            return `Sorry, I'm having trouble connecting to the safety assistant service right now. (${errorMessage})`;
        }

        if (responseData.choices && responseData.choices.length > 0) {
            const botResponseText = responseData.choices[0].message.content;
            
            // Add AI response to chat history
            chatHistory.push({ role: 'assistant', content: botResponseText });
            
            // Prune history if it gets too long
            const maxHistoryItems = 20; // Keep last 10 pairs
            if (chatHistory.length > maxHistoryItems) {
                chatHistory.splice(1, chatHistory.length - maxHistoryItems); // Keep system message
            }

            const formattedResponse = formatResponseText(botResponseText);
            const finalResponse = `🛡️ ${formattedResponse}\n\nNeed more help? 🤝`;
            
            // Save to full history
            addToFullHistory(userProblem, finalResponse);
            
            return finalResponse;
        } else {
            console.warn("Unexpected API response structure:", responseData);
            return "I'm sorry, I didn't get a proper response. Could you please try again?";
        }

    } catch (error) {
        console.error("Error fetching from OpenAI API:", error);
        return `There seems to be a network issue. Please check your internet connection (${error.message}).`;
    }
}

// Utility function for current time
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// --- Frontend UI Logic ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing chatbot...");
    
    // Initialize chat history from localStorage
    initializeChatHistory();
    
    // Show recent chats on startup
    showRecentChatsOnStartup();
    
    // Create floating hearts background
    createFloatingHearts();
    
    // Get DOM elements with safety checks
    const chatMessagesEl = document.getElementById('chatMessages');
    const userInputEl = document.getElementById('userInput');
    const sendButtonEl = document.getElementById('sendButton');
    const viewHistoryBtn = document.getElementById('historyButton');
    const clearHistoryBtn = document.getElementById('clearHistoryButton');
    const newChatBtn = document.getElementById('newChatButton'); // Added new chat button
    
    // Check if essential elements exist
    if (!chatMessagesEl || !userInputEl || !sendButtonEl) {
        console.error("Essential DOM elements not found!");
        alert("Chat interface not properly loaded. Please refresh the page.");
        return;
    }
    
    console.log("All essential DOM elements found successfully");
    
    // History button event listener
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => {
            console.log("History button clicked");
            showHistoryInModal();
        });
    }

    // IMPROVED Clear history button event listener
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            console.log("Clear history button clicked");
            clearAllHistory(); // Use the improved function
        });
    }

    // New chat button event listener (optional)
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            console.log("New chat button clicked");
            clearCurrentChatOnly();
        });
    }

    console.log(`📚 Chat history initialized: ${fullChatHistory.length} previous conversations loaded`);

    function addMessageToUI(text, sender, isTyping = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        // Force black text color for all messages
        messageElement.style.color = '#000';
        
        if (isTyping) {
            messageElement.classList.add('typing');
            messageElement.innerHTML = `
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
        } else {
            if (sender === 'bot') {
                messageElement.innerHTML = `
                    <span class="bot-message-decoration left">🛡️</span>
                    <span class="message-text" style="color: #000 !important;">${text}</span>
                    <span class="bot-message-decoration right">🤝</span>
                    <span class="message-time" style="color: #666 !important;">${getCurrentTime()}</span>
                `;
            } else {
                messageElement.innerHTML = `
                    <span class="message-text" style="color: #000 !important;">${text}</span>
                    <span class="message-time" style="color: #666 !important;">${getCurrentTime()}</span>
                `;
            }
        }
        
        chatMessagesEl.appendChild(messageElement);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        return messageElement;
    }

    async function handleUserSendMessage() {
        console.log("Send message function called");
        
        const messageText = userInputEl.value.trim();
        if (messageText === '') {
            console.log("Empty message, returning");
            userInputEl.focus();
            return;
        }

        console.log("Sending message:", messageText);
        
        // Add user message to UI
        addMessageToUI(messageText, 'user');
        userInputEl.value = '';
        
        // Show typing indicator
        const typingIndicator = addMessageToUI('', 'bot', true);

        try {
            console.log("Calling OpenAI API...");
            const botResponseText = await ChattingWithOpenAI(messageText);
            console.log("Got response:", botResponseText);
            
            // Remove typing indicator and show response
            chatMessagesEl.removeChild(typingIndicator);
            addMessageToUI(botResponseText, 'bot');
            
        } catch (error) {
            console.error("Error in handleUserSendMessage:", error);
            chatMessagesEl.removeChild(typingIndicator);
            addMessageToUI("Something went wrong, but don't worry—I'm still here to help. Please try again. 🛡️", 'bot');
        }
        
        // Focus back on input
        userInputEl.focus();
    }

    // Event listeners
    sendButtonEl.addEventListener('click', (e) => {
        console.log("Send button clicked");
        e.preventDefault();
        handleUserSendMessage();
    });
    
    userInputEl.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            console.log("Enter key pressed");
            event.preventDefault();
            handleUserSendMessage();
        }
    });
    
    console.log("Event listeners attached successfully");
    
    // Focus on input when page loads
    setTimeout(() => {
        userInputEl.focus();
    }, 100);
    
    // Test click functionality
    console.log("Testing send button click handler...");
    if (sendButtonEl) {
        console.log("Send button found and ready");
    } else {
        console.error("Send button not found!");
    }

    // 🚔 POLICE STATION FEATURE INITIALIZATION MESSAGE
    console.log("🚔 Police Station Feature: ENABLED");
    console.log("📍 Supported areas: Loni Kalbhor, Pune");
    console.log("💡 Keywords: 'police station', 'nearest police', 'police near me'");
    
    // Optional: Show feature announcement in chat
    setTimeout(() => {
        if (fullChatHistory.length === 0) {
            addMessageToUI(`🛡️ **Welcome to Sathi Safety Assistant!** 🤝

🆕 **New Feature Added:** Police Station Locator! 🚔

Simply type:
• "nearest police station"  
• "find police near me"
• "police help"

I'll show you the closest police stations in Loni Kalbhor area with contact details and directions!

How can I help keep you safe today?`, 'bot');
        }
    }, 1000);
});