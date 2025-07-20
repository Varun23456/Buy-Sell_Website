import { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await axios.get("http://localhost:4000/api/validate", {
          withCredentials: true,
        });
        if (response.status === 201) {
          let UserInfo = response.data.user;
          if (window.location.pathname !== "/ChatBot") {
            navigate("/ChatBot");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getreplyfrombot = async () => {
    if (input.trim() === "" || isLoading) return;
    
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);
    setIsTyping(true);
    
    const userMessage = { sender: "user", text: userInput };
    setMessages(prev => [...prev, userMessage]);
    const tempmessages = [...messages, userMessage];
    
    try {
      const response = await axios.post(
        "http://localhost:4000/api/chatbot",
        { message: userInput, history: tempmessages },
        { withCredentials: true }
      );

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMessage = { sender: "bot", text: response.data.reply };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
        ]);
        setIsTyping(false);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getreplyfrombot();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavBar />
      
      {/* Main Chat Container - Full Height */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-sm text-gray-600">Online & Ready to Help</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages Container - Takes remaining space */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm shadow-lg border-x border-gray-200/50 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to AI Assistant</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  I'm here to help you with questions, provide information, and assist with various tasks. What would you like to know?
                </p>
                
                {/* Quick Start Suggestions */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {[
                    "Tell me a joke",
                    "Explain quantum physics",
                    "Help with coding",
                    "Creative writing tips"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:text-blue-600 transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${msg.sender === "user" ? "ml-3" : "mr-3"}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                        : "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
                    }`}>
                      {msg.sender === "user" ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-4 rounded-2xl shadow-md backdrop-blur-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white/90 text-gray-800 rounded-bl-md border border-gray-200/50"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({children}) => (
                            <code className={`px-2 py-1 rounded text-xs font-mono ${
                              msg.sender === "user" ? "bg-blue-600/50" : "bg-gray-200"
                            }`}>
                              {children}
                            </code>
                          ),
                          pre: ({children}) => (
                            <pre className={`p-3 rounded-lg text-xs overflow-x-auto ${
                              msg.sender === "user" ? "bg-blue-600/50" : "bg-gray-100"
                            }`}>
                              {children}
                            </pre>
                          )
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex max-w-[75%]">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-9 h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-b-2xl shadow-lg p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                rows="1"
                className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 max-h-32 bg-white/90 backdrop-blur-sm"
                style={{
                  minHeight: '48px',
                  height: 'auto'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
                disabled={isLoading}
              />
              
              {/* Character count */}
              {input.length > 0 && (
                <div className="absolute bottom-1 left-3 text-xs text-gray-400">
                  {input.length}/2000
                </div>
              )}
            </div>

            <button
              onClick={getreplyfrombot}
              disabled={input.trim() === "" || isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              title={isLoading ? "Sending..." : "Send message"}
            >
              {isLoading ? (
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}