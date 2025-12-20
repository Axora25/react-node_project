import { useState, useEffect, useRef } from 'react';
import aphidsImg from '../assets/images/aphids.jpeg';
import cutwormsImg from '../assets/images/Cutworms.jpeg';
import powderyMildewImg from '../assets/images/powdery-mildew.jpg';
import armywormImg from '../assets/images/armyworm.jpeg';
import mitesImg from '../assets/images/Mites.webp';
import whitefliesImg from '../assets/images/Whiteflies1.jpg';

// Use backend proxy instead of calling Gemini API directly
const GEMINI_API_URL = 'http://localhost:5000/api/gemini';

// Pest data
const pestData = [
  {
    id: 1,
    name: 'Aphids',
    image: aphidsImg,
    symptoms: 'Curled leaves, sticky residue (honeydew)',
    affectedCrops: 'Vegetables, fruits, grains',
    prevention: 'Neem oil spray, natural predators like ladybugs'
  },
  {
    id: 2,
    name: 'Cutworms',
    image: cutwormsImg,
    symptoms: 'Damaged stems, missing seedlings',
    affectedCrops: 'Corn, tomato, lettuce',
    prevention: 'Barriers, nighttime inspection'
  },
  {
    id: 3,
    name: 'Powdery Mildew',
    image: powderyMildewImg,
    symptoms: 'White powder on leaves',
    affectedCrops: 'Squash, grapes, cereals',
    prevention: 'Proper spacing, sulfur-based fungicides'
  },
  {
    id: 4,
    name: 'Armyworm',
    image: armywormImg,
    symptoms: 'Ragged leaves, chewed stems',
    affectedCrops: 'Rice, maize, wheat',
    prevention: 'Handpicking, pheromone traps, biological control'
  },
  {
    id: 5,
    name: 'Spider Mites',
    image: mitesImg,
    symptoms: 'Fine webbing, yellow speckled leaves',
    affectedCrops: 'Tomatoes, beans, strawberries',
    prevention: 'Regular misting, predatory mites, insecticidal soap'
  },
  {
    id: 6,
    name: 'Whiteflies',
    image: whitefliesImg,
    symptoms: 'White insects flying when disturbed, yellow leaves',
    affectedCrops: 'Tomatoes, peppers, cucumbers',
    prevention: 'Yellow sticky traps, neem oil, beneficial insects'
  }
];

export default function PestManagement() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: "Hello! I'm your agricultural pest and disease expert. Ask me anything about crop pests, diseases, prevention methods, or treatment options. You can also upload images for visual analysis."
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    const msg = inputValue.trim();
    if (!msg && !selectedFile) return;

    // Add user message
    if (msg) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: msg
      };
      setMessages(prev => [...prev, userMessage]);
    }

    // Add file message if uploaded
    if (selectedFile) {
      const fileMessage = {
        id: Date.now() + 1,
        type: 'user',
        content: `Image uploaded: ${selectedFile.name}`,
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
    }

    setInputValue('');
    setIsLoading(true);

    try {
      let response;

      // If there's a selected file, send as multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        formData.append('message', msg);
        formData.append('file', selectedFile);

        response = await fetch(`${GEMINI_API_URL}/chat`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${GEMINI_API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: msg }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response) {
        const botMessage = {
          id: Date.now() + 2,
          type: 'bot',
          content: data.response
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now() + 2,
        type: 'error',
        content: `Sorry, I'm having trouble connecting to the AI service. Error: ${error.message}. Please make sure the backend server is running and the API key is configured in the backend .env file.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      // clear file input element if present
      try {
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (e) {
        // ignore
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputValue(`I've uploaded an image of what appears to be a pest or disease issue. Can you help me identify what this is and how to treat it?`);
    }
  };

  const generateSpraySchedule = async () => {
    setIsLoading(true);
    setShowDropdown(false);

    const loadingMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Generating personalized spray schedule...',
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const chatHistory = messages
        .filter(m => m.type === 'user' || m.type === 'bot')
        .map(m => m.content)
        .join(' ');

      const prompt = `You are an agricultural expert creating a spray schedule. Based on this conversation: "${chatHistory || 'No specific crop or pest mentioned yet. Please ask about your crops or pest issues first.'}", 

please create a detailed, practical spray schedule for the farmer. 

Format the response as a simple date-wise schedule with the following structure:

**Week 1 (Date):**
• Time: [specific time]
• Product: [product name and dilution]
• Method: [application method]
• Notes: [important notes]

**Week 2 (Date):**
• Time: [specific time]
• Product: [product name and dilution]
• Method: [application method]
• Notes: [important notes]

Continue for 3-4 weeks. Include:
1. Crop type and current growth stage
2. Identified pests/diseases
3. Recommended treatments with specific products
4. Application schedule (dates and times)
5. Safety precautions
6. Alternative organic options

Keep it simple and easy to follow. Don't use tables, just use bullet points and clear dates.`;

      const response = await fetch(`${GEMINI_API_URL}/spray-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory: chatHistory,
          prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove loading message
      setMessages(prev => prev.filter(m => !m.isLoading));

      if (data.response) {
        const scheduleMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: `🌱 Personalized Spray Schedule\n\n${data.response}\n\n💡 Tip: Always follow safety guidelines and wear protective equipment when applying pesticides.`,
          isSchedule: true
        };
        setMessages(prev => [...prev, scheduleMessage]);
      } else {
        throw new Error('Unexpected API response');
      }
    } catch (error) {
      console.error('Spray Schedule Error:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading);
        return [...filtered, {
          id: Date.now() + 1,
          type: 'error',
          content: 'Sorry, I couldn\'t generate a spray schedule. Please try again or consult with a local agricultural expert.'
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rateChatbot = (rating) => {
    const ratingMessage = {
      id: Date.now(),
      type: 'user',
      content: `You rated the chatbot as: ${rating === 'yes' ? '👍 Helpful' : '👎 Not Helpful'}`
    };
    setMessages(prev => [...prev, ratingMessage]);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: rating === 'yes' 
          ? "Thank you! I'm glad I could help. Feel free to ask more questions about your crops."
          : "I'm sorry I couldn't help enough. Please try asking your question in a different way or provide more details about your specific issue."
      };
      setMessages(prev => [...prev, botResponse]);

      // Store rating in localStorage
      try {
        const ratings = JSON.parse(localStorage.getItem('chatbot_ratings') || '[]');
        ratings.push({
          rating: rating,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        localStorage.setItem('chatbot_ratings', JSON.stringify(ratings));
      } catch (e) {
        console.log('Could not save rating:', e);
      }
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="font-mono bg-gray-950 text-white min-h-screen">
      <main className="flex flex-col min-h-[300px]">
        <div className="flex flex-col md:flex-row bg-gray-950">
          {/* Left: Info Section */}
          <section className="md:w-1/3 p-3 md:p-4 bg-gray-950 flex flex-col" style={{ height: '90vh' }}>
            <div className="bg-gray-800 rounded-xl shadow-lg p-3 flex flex-col h-full border border-gray-700">
              <div className="overflow-y-auto flex-1 h-full pr-2 custom-scrollbar">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-400 top-0 bg-inherit py-2 z-10">
                  Pest & Disease Control
                </h1>
                <p className="text-base text-gray-400 mb-6">
                  Learn about common crop pests, their signs, and how to control them using safe and effective methods.
                </p>

                <div className="space-y-4 pb-3">
                  {pestData.map((pest) => (
                    <div
                      key={pest.id}
                      className="bg-gray-950 rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3 items-center border border-gray-700"
                    >
                      <img
                        src={pest.image}
                        alt={pest.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                      />
                      <div>
                        <h2 className="text-lg font-semibold mb-1 text-blue-400">{pest.name}</h2>
                        <div className="text-xs text-gray-400 mb-1">
                          <b>Symptoms:</b> {pest.symptoms}
                        </div>
                        <div className="text-xs text-gray-400 mb-1">
                          <b>Affected Crops:</b> {pest.affectedCrops}
                        </div>
                        <div className="text-xs text-gray-400">
                          <b>Prevention/Treatment:</b> {pest.prevention}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Right: Chatbot Section */}
          <section className="p-3 md:p-4 bg-gray-950 flex flex-col flex-1" style={{ height: '90vh' }}>
            <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-full border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-400">Agriculture Help Desk</h2>
                  <p className="text-xs text-gray-400">
                    Ask about pests, plant diseases, or crop issues and get instant, reliable solutions.
                  </p>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="bg-gray-950 rounded-lg p-3 flex-1 overflow-y-auto shadow-inner mb-3 border border-gray-700 flex flex-col custom-scrollbar">
                <div className="space-y-2 flex-1">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.type !== 'user' && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className={`fas ${message.type === 'error' ? 'fa-exclamation-triangle' : 'fa-robot'} text-white text-sm`}></i>
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-500 bg-opacity-20 max-w-xs'
                            : message.type === 'error'
                            ? 'bg-red-500 bg-opacity-20 flex-1'
                            : message.isSchedule
                            ? 'bg-blue-500 bg-opacity-10 flex-1'
                            : 'bg-gray-600 bg-opacity-20 flex-1'
                        }`}
                      >
                        <div className={`font-semibold mb-1 ${
                          message.type === 'user' ? 'text-blue-400' : 
                          message.type === 'error' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                          {message.type === 'user' ? 'You' : 
                           message.type === 'error' ? 'Error' : 
                           message.isSchedule ? '🌱 Personalized Spray Schedule' : 'AI Assistant'}
                        </div>
                        {message.isLoading ? (
                          <div className="text-sm flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                            {message.content}
                          </div>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition focus:outline-none"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    {showDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white text-gray-800 border border-blue-500 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-100 flex items-center gap-2"
                        >
                          <i className="fas fa-paperclip"></i> Upload Image
                        </button>
                        <button
                          onClick={generateSpraySchedule}
                          className="w-full text-left px-4 py-2 hover:bg-blue-100 flex items-center gap-2"
                        >
                          <i className="fas fa-calendar-alt"></i> Generate Spray Schedule
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow relative flex items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e)}
                      className="w-full px-3 py-2 pl-10 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="Describe the pest or disease issue..."
                      disabled={isLoading}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold shadow transition flex items-center gap-1 text-sm disabled:opacity-50"
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Section */}
        <section className="bg-gray-800 border-t border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow">
          <div className="text-white text-base flex items-center gap-2">
            <span>Was the chatbot helpful?</span>
            <button
              onClick={() => rateChatbot('yes')}
              className="ml-2 text-blue-400 hover:underline font-semibold transition"
            >
              Yes
            </button>
            <button
              onClick={() => rateChatbot('no')}
              className="ml-2 text-red-400 hover:underline font-semibold transition"
            >
              No
            </button>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.6) rgba(55, 65, 81, 0.3);
        }
      `}</style>
    </div>
  );
}

