import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, MessageSquare, RefreshCcw } from 'lucide-react';
import { aiAPI } from '../services/api';
import './AIAssistantPage.css';

const FEATURES = [
  { icon: '✍️', title: 'Professional Rephrasing', desc: 'Paste any sentence and get a polished, resume-ready version' },
  { icon: '💡', title: 'Skill Suggestions', desc: 'Get role-specific skill recommendations to boost your profile' },
  { icon: '📊', title: 'ATS Optimization Tips', desc: 'Learn how to make your resume more ATS-friendly' },
  { icon: '📝', title: 'Summary Writing', desc: 'Get help crafting a compelling professional summary' },
  { icon: '🎯', title: 'Action Verbs', desc: 'Discover powerful action verbs to start your bullet points' },
  { icon: '🔄', title: 'Content Improvement', desc: 'Improve any section of your resume with AI guidance' },
];

const QUICK_PROMPTS = [
  { label: 'Rephrase a sentence', prompt: 'Make this professional: "I worked on building a website for customers"' },
  { label: 'Skills for SWE', prompt: 'What skills should I have as a Software Engineer?' },
  { label: 'ATS tips', prompt: 'Give me tips to improve my ATS score' },
  { label: 'Write summary', prompt: 'Help me write a professional summary for a Full Stack Developer with 3 years experience' },
  { label: 'Action verbs', prompt: 'Give me powerful action verbs for a tech resume' },
  { label: 'Improve bullet', prompt: 'Make this sound better: "was responsible for testing and fixing bugs in the codebase"' },
];

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([{
    id: 1, role: 'bot',
    text: "Hi! I'm your SkillFolio AI Assistant 🤖\n\nI can help you craft a professional resume by:\n• Rephrasing sentences into polished language\n• Recommending skills for your target role\n• Giving ATS optimization advice\n• Writing or improving any resume section\n\nWhat would you like help with today?",
  }]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  // Keep chat history for context (exclude the intro message)
  const historyRef = useRef([]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || isTyping) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await aiAPI.chat({ message: msg, history: historyRef.current });
      const reply = data.reply;

      // Update history for next turn
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: msg },
        { role: 'assistant', content: reply },
      ];

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot',
        text: "Sorry, I couldn't connect to the AI service. Make sure the backend is running on port 5000.",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{ id: 1, role: 'bot', text: "Chat cleared! How can I help you today?" }]);
  };

  const formatText = (text) => text.split('\n').map((line, i) => {
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />;
  });

  return (
    <div className="ai-page">
      <div className="container">
        <div className="ai-header">
          <p className="section-eyebrow"><Sparkles size={13} /> AI Assistant</p>
          <h1 className="ai-title">SkillFolio AI Assistant</h1>
          <p className="ai-subtitle">Your intelligent writing partner for building a standout resume</p>
        </div>

        <div className="ai-layout">
          {/* Left: features */}
          <aside className="ai-features-panel">
            <h3 className="features-panel-title">What I can do</h3>
            <div className="features-list">
              {FEATURES.map((f, i) => (
                <div key={i} className="ai-feature-item">
                  <span className="feature-emoji">{f.icon}</span>
                  <div>
                    <div className="feature-name">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right: chat */}
          <div className="ai-chat-panel">
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <div className="ai-avatar"><Bot size={20} /></div>
                <div>
                  <div className="ai-chat-name">SkillFolio AI</div>
                  <div className="ai-online"><span className="online-dot" /> Online</div>
                </div>
              </div>
              <button className="clear-btn" onClick={clearChat}><RefreshCcw size={15} /> Clear Chat</button>
            </div>

            <div className="ai-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-msg ${msg.role}`}>
                  <div className="ai-msg-avatar">
                    {msg.role === 'bot' ? <Bot size={15} /> : <User size={15} />}
                  </div>
                  <div className="ai-msg-bubble">
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="ai-msg bot">
                  <div className="ai-msg-avatar"><Bot size={15} /></div>
                  <div className="ai-msg-bubble typing-bubble">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="ai-quick-prompts">
              <p className="qp-label"><MessageSquare size={12} /> Try a prompt:</p>
              <div className="qp-list">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} className="qp-btn" onClick={() => sendMessage(p.prompt)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-input-row">
              <input
                type="text"
                className="ai-input"
                placeholder="Ask anything — paste text to improve, ask for skills, get resume tips..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className="ai-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || isTyping}>
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;