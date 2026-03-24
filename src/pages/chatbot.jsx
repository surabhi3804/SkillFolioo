// src/pages/chatbot.jsx — AI Assistant Page (session history)
import { useState, useRef, useEffect } from "react";
import "./chatbot.css";

// ── Rule-based responses ─────────────────────────────────────
const getAIResponse = (userMsg) => {
  const msg = userMsg.toLowerCase();
  if (msg.includes('professional') || msg.includes('rephrase') || msg.includes('convert') || msg.includes('make')) {
    return `Here's a more professional version:\n\nTip: Use strong action verbs like Led, Developed, Optimized, Implemented, Delivered, Collaborated, Designed, Built, Architected to start your bullet points.`;
  }
  if (msg.includes('skill') && (msg.includes('suggest') || msg.includes('recommend'))) {
    return `Here are in-demand skills for tech roles:\n\nCore: Python, TypeScript, System Design, REST APIs\nCloud: AWS, Docker, Kubernetes\nAI/ML: LLMs, TensorFlow, PyTorch\nTools: Git, CI/CD, Agile\n\nTip: Add skills that match the job description keywords for a higher ATS score!`;
  }
  if (msg.includes('ats')) {
    return `ATS Tips:\n\n1. Use keywords from the job description\n2. Avoid tables, graphics, and columns\n3. Use standard section headings\n4. Include both acronyms and full forms\n5. Quantify achievements with numbers`;
  }
  if (msg.includes('summary') || msg.includes('about me') || msg.includes('bio')) {
    return `Strong professional summary template:\n\n"[Job Title] with [X] years of experience in [domain]. Proven track record of [key achievement]. Skilled in [top 3 skills]."\n\nExample:\n"Full Stack Developer with 3 years of experience in React and Node.js. Delivered scalable web applications serving 50K+ users."`;
  }
  if (msg.includes('action verb') || msg.includes('bullet')) {
    return `Power action verbs:\n\n🚀 Development: Built, Developed, Engineered, Architected\n📈 Leadership: Led, Directed, Mentored, Spearheaded\n⚡ Achievement: Delivered, Achieved, Optimized, Reduced\n🔧 Collaboration: Collaborated, Coordinated, Partnered`;
  }
  if (msg.includes('cover letter') || msg.includes('cover')) {
    return `Strong cover letter opening:\n\n"As a [Your Role] with [X] years of experience in [domain], I am excited to bring my expertise in [key skill] to [Company Name]."\n\nTip: Tailor this to the specific job description!`;
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hi there! 👋 I'm your SkillFolio AI Assistant.\n\nI can help you with:\n• Rephrasing sentences professionally\n• Writing strong resume bullets\n• ATS optimization tips\n• Professional summary writing\n\nJust paste any text to get started!`;
  }
  return null;
};

const QUICK_RESPONSES = {
  improve: "Sure! Paste your bullet point below and I'll rewrite it with stronger action verbs. 💪",
  summary: "Tell me your job title and top 2 strengths — I'll craft a compelling professional summary. 📝",
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

const CONTEXTS = ["Experience", "Skills", "Projects", "Summary", "Education"];
const TONES    = ["Professional", "Technical", "Leadership"];
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

export default function ChatbotPage({ onUseText }) {
  const [msgs,    setMsgs]    = useState([mkMsg("bot", "Hi! 👋 I'm your SkillFolio AI Assistant.\n\nPaste any informal description and I'll rewrite it professionally. Or ask me anything about resume writing!")]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const [ctx,     setCtx]     = useState("Experience");
  const [tone,    setTone]    = useState("Professional");
  const [copied,  setCopied]  = useState(null);
  const [history, setHistory] = useState([]); // session-only history
  const [histTab, setHistTab] = useState("chat");
  const endRef  = useRef(null);
  const textRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  // ── Send message ─────────────────────────────────────────
  function send(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    setMsgs(p => [...p, mkMsg("user", msg)]);
    setInput("");
    setTyping(true);

    const ruleResponse = getAIResponse(msg);
    if (ruleResponse !== null) {
      setTimeout(() => {
        setTyping(false);
        setMsgs(p => [...p, mkMsg("bot", ruleResponse)]);
      }, 700);
      return;
    }

    fetch("/api/chatbot/enhance", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text: msg, context: ctx, tone }),
    })
      .then(r => r.json())
      .then(data => {
        setTyping(false);
        if (!data.success) {
          setMsgs(p => [...p, mkMsg("bot", "Got it! Can you share a bit more detail? 🎯")]);
          return;
        }
        setMsgs(p => [...p, mkMsg("bot", "✨ Here's a polished version:", data.enhanced, data.metric_tip)]);
        // ── Save to session history ──
        setHistory(h => [{
          id:        Date.now(),
          original:  msg,
          enhanced:  data.enhanced,
          tip:       data.metric_tip,
          context:   ctx,
          tone,
          time:      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date:      new Date().toLocaleDateString(),
        }, ...h]);
      })
      .catch(() => {
        setTyping(false);
        setMsgs(p => [...p, mkMsg("bot", "Something went wrong. Make sure the backend is running! 🔧")]);
      });
  }

  function quickAction(id) {
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(p => [...p, mkMsg("bot", QUICK_RESPONSES[id])]); }, 550);
  }

  function copyText(text, id) {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 1800); });
  }

  function deleteHistoryItem(id) {
    setHistory(h => h.filter(i => i.id !== id));
  }

  function clearAllHistory() {
    if (window.confirm("Clear all history for this session?")) setHistory([]);
  }

  function exportHistory() {
    if (!history.length) return;
    const lines = history.map((h, i) =>
      `[${i + 1}] ${h.date} ${h.time} | ${h.context} | ${h.tone}\nOriginal : ${h.original}\nEnhanced : ${h.enhanced}\n`
    ).join("\n---\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "skillfolio-ai-history.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="chatbot-page fade-up">
      <div className="chatbot-page-head">
        <span className="sec-tag">AI Assistant</span>
        <h2 className="sec-title">AI Content <em>Enhancement</em></h2>
        <p className="sec-sub">Paste informal descriptions and the AI transforms them into professional, ATS-ready resume language.</p>
      </div>

      <div className="chatbot-layout">
        {/* ── Chat Widget ── */}
        <div className="chatbot-widget">
          <div className="cbot-head">
            <div className="cbot-avatar">🤖</div>
            <div>
              <div className="cbot-name">Folio AI Assistant</div>
              <div className="cbot-status"><span className="cbot-dot" />NLP Engine Active</div>
            </div>
            <div className="cbot-ctrls">
              <button className="cbot-ctrl-btn" title="Clear chat"
                onClick={() => setMsgs([mkMsg("bot", "Chat cleared! Paste anything to get started. 💬")])}>🗑</button>
            </div>
          </div>

          {/* Context + Tone */}
          <div className="cbot-ctx">
            <span className="cbot-ctx-lbl">Context:</span>
            {CONTEXTS.map(c => (
              <button key={c} className={`cbot-chip${ctx === c ? " active" : ""}`} onClick={() => setCtx(c)}>{c}</button>
            ))}
            <span className="cbot-ctx-divider">|</span>
            <span className="cbot-ctx-lbl">Tone:</span>
            {TONES.map(t => (
              <button key={t} className={`cbot-chip${tone === t ? " tone-active" : ""}`} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="cbot-msgs">
            {msgs.map(m => (
              <div key={m.id} className={`cbot-msg ${m.role}`}>
                <div className="cbot-msg-av">{m.role === "bot" ? "AI" : "U"}</div>
                <div>
                  <div className="cbot-bubble">
                    {m.text.split('\n').map((line, i) => <div key={i}>{line || <br />}</div>)}
                    <div className="cbot-time">{m.time}</div>
                    {m.enhanced && (
                      <div className="cbot-enhanced">
                        <div className="cbot-enhanced-lbl">✦ Enhanced Version</div>
                        <div className="cbot-enhanced-txt">{m.enhanced}</div>
                        {m.tip && <div className="cbot-enhanced-tip">💡 Consider adding a metric — e.g., "{m.tip}"</div>}
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
              <button key={a.id} className="cbot-quick-btn" onClick={() => quickAction(a.id)}>{a.label}</button>
            ))}
          </div>

          {/* Examples */}
          {msgs.length <= 1 && (
            <div className="cbot-examples">
              <div className="cbot-ex-lbl">Try an example:</div>
              <div className="cbot-ex-row">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} className="cbot-ex-chip" onClick={() => { setInput(ex); textRef.current?.focus(); }}>"{ex}"</button>
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
            <div className="cbot-input-right">
              <span className="cbot-char-count">{input.length} chars</span>
              <button className="cbot-send" onClick={() => send()} disabled={!input.trim() || typing}>➤</button>
            </div>
          </div>
        </div>

        {/* ── History Panel ── */}
        <div className="cbot-history-panel">
          <div className="cbot-hist-head">
            <div className="cbot-hist-tabs">
              <button className={`cbot-hist-tab${histTab === "chat" ? " active" : ""}`} onClick={() => setHistTab("chat")}>💬 Info</button>
              <button className={`cbot-hist-tab${histTab === "history" ? " active" : ""}`} onClick={() => setHistTab("history")}>
                🕐 History {history.length > 0 && <span className="cbot-hist-badge">{history.length}</span>}
              </button>
            </div>
            {histTab === "history" && history.length > 0 && (
              <div className="cbot-hist-actions">
                <button className="cbot-hist-export" onClick={exportHistory}>⬇ Export</button>
                <button className="cbot-hist-clear"  onClick={clearAllHistory}>🗑</button>
              </div>
            )}
          </div>

          {histTab === "chat" ? (
            <div className="cbot-hist-info">
              <div className="cbot-info-card">
                <div className="cbot-info-title">How it works</div>
                {[
                  ["1", "Paste informal text",  "Type or paste any experience in plain English"],
                  ["2", "AI Processing",        "Engine upgrades verbs, removes filler, adds structure"],
                  ["3", "Review & Use",         "Copy the enhanced version into your resume"],
                ].map(([n, t, d]) => (
                  <div key={n} className="cbot-step">
                    <div className="cbot-step-num">{n}</div>
                    <div><div className="cbot-step-title">{t}</div><div className="cbot-step-desc">{d}</div></div>
                  </div>
                ))}
              </div>
              <div className="cbot-info-card dark">
                <div className="cbot-feat-title">AI Features</div>
                {["Strong action verb upgrade", "Filler word removal", "Metric detection & tips", "Tone-aware enhancement", "ATS structure formatting", "Session history & export"].map(f => (
                  <div key={f} className="cbot-feat-item">
                    <span className="cbot-feat-check">✓</span>
                    <span className="cbot-feat-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="cbot-hist-list">
              {history.length === 0 ? (
                <div className="cbot-hist-empty">
                  <div className="cbot-hist-empty-icon">📝</div>
                  <div>No history yet.</div>
                  <div className="cbot-hist-empty-sub">Enhanced texts will appear here during this session.</div>
                </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="cbot-hist-item">
                    <div className="cbot-hist-item-meta">
                      <span className="cbot-hist-ctx">{item.context}</span>
                      <span className="cbot-hist-tone">{item.tone}</span>
                      <span className="cbot-hist-date">{item.time}</span>
                    </div>
                    <div className="cbot-hist-original">"{item.original}"</div>
                    <div className="cbot-hist-enhanced">{item.enhanced}</div>
                    <div className="cbot-hist-item-acts">
                      <button className="cbot-hist-copy" onClick={() => copyText(item.enhanced, item.id)}>
                        {copied === item.id ? "✓ Copied!" : "Copy"}
                      </button>
                      <button className="cbot-hist-del" onClick={() => deleteHistoryItem(item.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}