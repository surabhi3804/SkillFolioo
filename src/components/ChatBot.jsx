import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ChatBot.css';

const QUICK_PROMPTS = [
  'Make this professional: "I worked on a website"',
  'Rephrase for resume: "helped my team fix bugs"',
  'Convert to action verb: "was responsible for testing"',
  'Suggest skills for Software Engineer',
];

const getAIResponse = (userMsg) => {
  const msg = userMsg.toLowerCase();

  if (msg.includes('professional') || msg.includes('rephrase') || msg.includes('convert') || msg.includes('make')) {
    const original = userMsg.replace(/^(make this professional|rephrase for resume|convert to action verb|improve):?\s*/i, '').trim();
    return `Here's a more professional version:\n\n✨ **"${original}"** →\n\n*"Spearheaded development and implementation of key initiatives, driving measurable impact and cross-functional collaboration to achieve organizational objectives."*\n\nTip: Use strong action verbs like *Led, Developed, Optimized, Implemented, Delivered, Collaborated, Designed, Built, Architected* to start your bullet points.`;
  }

  if (msg.includes('skill') && (msg.includes('suggest') || msg.includes('recommend'))) {
    return `Here are in-demand skills for tech roles in 2024:\n\n**Core:** Python, TypeScript, System Design, REST APIs\n**Cloud:** AWS, Docker, Kubernetes\n**AI/ML:** LLMs, TensorFlow, PyTorch\n**Tools:** Git, CI/CD, Agile\n\nTip: Add skills that match the job description keywords for a higher ATS score!`;
  }

  if (msg.includes('ats')) {
    return `**ATS (Applicant Tracking System) Tips:**\n\n1. Use keywords from the job description\n2. Avoid tables, graphics, and columns\n3. Use standard section headings (Experience, Education, Skills)\n4. Include both acronyms and full forms (e.g., ML & Machine Learning)\n5. Quantify achievements with numbers\n\nUse SkillFolio's ATS Score page to see your resume's score!`;
  }

  if (msg.includes('summary') || msg.includes('about me') || msg.includes('bio')) {
    return `Here's a template for a strong professional summary:\n\n*"[Job Title] with [X] years of experience in [domain]. Proven track record of [key achievement]. Skilled in [top 3 skills]. Passionate about [area] and committed to [value you bring]."*\n\nExample:\n*"Full Stack Developer with 3 years of experience in React and Node.js. Delivered scalable web applications serving 50K+ users. Skilled in TypeScript, PostgreSQL, and AWS. Passionate about clean architecture and developer experience."*`;
  }

  if (msg.includes('action verb') || msg.includes('bullet')) {
    return `**Power action verbs for your resume:**\n\n🚀 *Development:* Built, Developed, Engineered, Architected, Designed\n📈 *Leadership:* Led, Directed, Mentored, Spearheaded, Championed\n⚡ *Achievement:* Delivered, Achieved, Exceeded, Optimized, Reduced\n🔧 *Collaboration:* Collaborated, Coordinated, Partnered, Facilitated\n\nAlways start bullet points with a past-tense action verb!`;
  }

  return `I can help you with:\n\n• **Professional rephrasing** – paste any sentence and I'll make it resume-ready\n• **Skill suggestions** for specific roles\n• **ATS optimization** tips\n• **Summary writing** guidance\n• **Action verb recommendations**\n\nJust type your question or paste a sentence to improve!`;
};

const ChatBot = () => {
  const { chatOpen, setChatOpen } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Hi! I'm your SkillFolio AI Assistant 👋\n\nI can help you:\n• Rephrase sentences into professional language\n• Suggest skills for your target role\n• Give ATS optimization tips\n• Help craft your resume summary\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: response }]);
      setIsTyping(false);
    }, 900);
  };

  const formatText = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return <p key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />;
      });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chatbot-fab ${chatOpen ? 'active' : ''}`}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Open AI Assistant"
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!chatOpen && <span className="fab-label">AI Assistant</span>}
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="chatbot-panel animate-fadeIn">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="chat-title">SkillFolio AI</div>
                <div className="chat-status">
                  <span className="status-dot" />
                  Always online
                </div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>
              <Minimize2 size={16} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="msg-bubble">
                  {formatText(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <div className="msg-avatar"><Bot size={14} /></div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-prompts">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything or paste text to improve..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
