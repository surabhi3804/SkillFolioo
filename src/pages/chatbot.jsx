// Chatbot.js — Module 3: AI Content Enhancement (Rule-based NLP)
import { useState, useRef, useEffect } from "react";
import "./chatbot.css";

const QUICK_RESPONSES = {
  improve: "Sure! Paste your bullet point below and I'll rewrite it with stronger action verbs. 💪",
  summary: "Tell me your job title and top 2 strengths — I'll craft a compelling 3-sentence professional summary. 📝",
  skill:   "Which skill would you like to highlight? Tell me how you've used it and I'll make it shine. ⚡",
  project: "Describe your project in plain language — what did you build and what problem did it solve? 🚀",
  cover:   "Tell me the role you're applying for and your top strength — I'll write a strong opening line. ✉️",
};

const EXAMPLES = [
  "built a chat app with react and node for college fest",
  "did some ML stuff for final year project",
  "worked on a website and made it faster",
  "helped manage a team and conducted meetings",
];

const CONTEXTS      = ["Experience", "Skills", "Projects", "Summary", "Education"];
const QUICK_ACTIONS = [
  { id: "improve", label: "✦ Enhance bullet"   },
  { id: "summary", label: "📝 Write summary"    },
  { id: "skill",   label: "⚡ Describe skill"   },
  { id: "project", label: "🚀 Describe project" },
  { id: "cover",   label: "✉ Cover letter"      },
];

let mid = 1;
const mkMsg = (role, text, enhanced = null, tip = null) => ({
  id: mid++, role, text, enhanced, tip,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
});

export default function Chatbot({ onUseText }) {
  const [msgs,    setMsgs]    = useState([mkMsg("bot", "Hi! 👋 Describe your project or experience and I'll rewrite it professionally for your resume.")]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const [ctx,     setCtx]     = useState("Experience");
  const [copied,  setCopied]  = useState(null);
  const endRef  = useRef(null);
  const textRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  function send(text) {
    const msg = text || input;
    if (!msg.trim()) return;

    setMsgs(p => [...p, mkMsg("user", msg)]);
    setInput("");
    setTyping(true);

    // ── Backend call ──
    fetch("http://localhost:5000/api/chatbot/enhance", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text: msg, context: ctx }),
    })
      .then(res => res.json())
      .then(data => {
        setTyping(false);
        if (!data.success) {
          // Too short or error
          setMsgs(p => [...p, mkMsg("bot", "Got it! Can you share a bit more detail? I'll turn it into a strong bullet point. 🎯")]);
          return;
        }
        // Success — friendly reply like before
        setMsgs(p => [...p, mkMsg("bot", "✨ Here's a polished version:", data.enhanced, data.metric_tip)]);
      })
      .catch(() => {
        setTyping(false);
        setMsgs(p => [...p, mkMsg("bot", "Hmm, something went wrong. Make sure the backend server is running and try again! 🔧")]);
      });
  }

  function quickAction(id) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, mkMsg("bot", QUICK_RESPONSES[id])]);
    }, 550);
  }

  function copyText(text, id) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  return (
    <div className="chatbot-page fade-up">
      <div className="chatbot-page-head">
        <span className="sec-tag">Ai Assistant </span>
        <h2 className="sec-title">AI Content <em>Enhancement</em></h2>
        <p className="sec-sub">Paste informal descriptions and the AI transforms them into professional, ATS-ready resume language using rule-based NLP.</p>
      </div>

      <div className="chatbot-layout">
        {/* Widget */}
        <div className="chatbot-widget">

          {/* Header */}
          <div className="cbot-head">
            <div className="cbot-avatar">🤖</div>
            <div>
              <div className="cbot-name">Folio AI Assistant</div>
              <div className="cbot-status"><span className="cbot-dot" />NLP Engine Active</div>
            </div>
            <div className="cbot-ctrls">
              <button
                className="cbot-ctrl-btn"
                title="Clear"
                onClick={() => setMsgs([mkMsg("bot", "Chat cleared. Paste anything to get started! 💬")])}
              >🗑</button>
              <button className="cbot-ctrl-btn">−</button>
            </div>
          </div>

          {/* Context */}
          <div className="cbot-ctx">
            <span className="cbot-ctx-lbl">Context:</span>
            {CONTEXTS.map(c => (
              <button
                key={c}
                className={`cbot-chip${ctx === c ? " active" : ""}`}
                onClick={() => setCtx(c)}
              >{c}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="cbot-msgs">
            {msgs.map(m => (
              <div key={m.id} className={`cbot-msg ${m.role}`}>
                <div className="cbot-msg-av">{m.role === "bot" ? "AI" : "U"}</div>
                <div>
                  <div className="cbot-bubble">
                    {m.text}
                    <div className="cbot-time">{m.time}</div>
                    {m.enhanced && (
                      <div className="cbot-enhanced">
                        <div className="cbot-enhanced-lbl">✦ Enhanced Version</div>
                        <div className="cbot-enhanced-txt">{m.enhanced}</div>
                        {m.tip && (
                          <div className="cbot-enhanced-tip">
                            💡 Consider adding a metric — e.g., "{m.tip}"
                          </div>
                        )}
                        <div className="cbot-enhanced-acts">
                          <button className="cbot-copy-btn" onClick={() => copyText(m.enhanced, m.id)}>
                            {copied === m.id ? "✓ Copied!" : "Copy"}
                          </button>
                          {onUseText && (
                            <button className="cbot-use-btn" onClick={() => onUseText(m.enhanced, ctx.toLowerCase())}>
                              Use in Resume
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="cbot-msg bot">
                <div className="cbot-msg-av">AI</div>
                <div className="cbot-typing">
                  <div className="cbot-dot-t" /><div className="cbot-dot-t" /><div className="cbot-dot-t" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick actions */}
          <div className="cbot-quick">
            {QUICK_ACTIONS.map(a => (
              <button key={a.id} className="cbot-quick-btn" onClick={() => quickAction(a.id)}>
                {a.label}
              </button>
            ))}
          </div>

          {/* Examples — only show on first load */}
          {msgs.length <= 1 && (
            <div className="cbot-examples">
              <div className="cbot-ex-lbl">Try an example:</div>
              <div className="cbot-ex-row">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} className="cbot-ex-chip" onClick={() => { setInput(ex); textRef.current?.focus(); }}>
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="cbot-input-area">
            <textarea
              ref={textRef}
              className="cbot-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Paste your ${ctx.toLowerCase()} description... (Enter to send)`}
              rows={1}
            />
            <button className="cbot-send" onClick={() => send()} disabled={!input.trim() || typing}>➤</button>
          </div>
        </div>

        {/* Side panels */}
        <div>
          <div className="cbot-info-card">
            <div className="cbot-info-title">How it works</div>
            {[
              ["1", "Paste informal text",  "Type or paste any experience in plain English"],
              ["2", "NLP Processing",       "Engine upgrades verbs, removes filler, adds structure"],
              ["3", "Review & Use",         "Copy the enhanced version into your resume"],
            ].map(([n, t, d]) => (
              <div key={n} className="cbot-step">
                <div className="cbot-step-num">{n}</div>
                <div>
                  <div className="cbot-step-title">{t}</div>
                  <div className="cbot-step-desc">{d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="cbot-info-card dark">
            <div className="cbot-feat-title">NLP Features</div>
            {[
              "Strong action verb upgrade",
              "Filler word removal",
              "Metric detection & tips",
              "Tense consistency",
              "Professional tone shaping",
              "ATS structure formatting",
            ].map(f => (
              <div key={f} className="cbot-feat-item">
                <span className="cbot-feat-check">✓</span>
                <span className="cbot-feat-text">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}