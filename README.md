# SkillFolio – Resume & Portfolio Generator

A full-featured React frontend for SkillFolio, an AI-powered resume and portfolio builder for engineers and developers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd skillfolio

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at **http://localhost:3000**

---

## 📁 Project Structure

```
skillfolio/
├── public/
│   └── index.html               # HTML entry point (loads Google Fonts)
├── src/
│   ├── context/
│   │   └── AppContext.jsx        # Global state management (auth, resume data, etc.)
│   ├── data/
│   │   └── staticData.js         # Templates, roles, skills, presets
│   ├── components/
│   │   ├── Navbar.jsx / .css     # Top navigation bar
│   │   ├── ChatBot.jsx / .css    # Floating AI chatbot (bottom-right)
│   │   └── ProtectedRoute.jsx   # Auth guard for protected pages
│   ├── pages/
│   │   ├── HomePage.jsx / .css     # Landing page
│   │   ├── SignInPage.jsx / .css   # Sign-in form
│   │   ├── TemplatesPage.jsx / .css # Template selection (6 + custom)
│   │   ├── BuilderPage.jsx / .css  # Resume data entry form
│   │   ├── PreviewPage.jsx / .css  # Resume preview + ATS + Portfolio
│   │   ├── ATSScorePage.jsx / .css # Dedicated ATS score calculator
│   │   ├── SkillAnalyticsPage.jsx / .css # Skill gap analysis
│   │   └── AIAssistantPage.jsx / .css    # Full AI assistant chat page
│   ├── styles/
│   │   └── global.css            # Global CSS variables, resets, utilities
│   ├── App.jsx                   # Router + layout
│   └── index.js                  # React entry point
└── package.json
```

---

## 📄 Pages & Features

| Route | Page | Access |
|-------|------|--------|
| `/` | Home Page | Public |
| `/signin` | Sign In | Public |
| `/templates` | Template Selection | Auth required |
| `/builder` | Resume Builder | Auth required |
| `/preview` | Resume Preview + ATS | Auth required |
| `/ats-score` | ATS Score Calculator | Auth required |
| `/skill-analytics` | Skill Analytics | Auth required |
| `/ai-assistant` | AI Writing Assistant | Auth required |

---

## ✨ Key Features

- **6 ATS-ready templates** + custom template option
- **Resume builder** with collapsible sections for all data fields
- **Smart skill selector** with autocomplete suggestions from 100+ skills
- **Resume preview** with customizable color & font
- **ATS score** calculated against 16 engineering/tech roles
- **Skill analytics** with gap analysis and role match percentage
- **Web portfolio generator** with one-click publish
- **AI chatbot** (floating FAB + dedicated page) for professional writing help
- **Protected routes** with auth guard

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` (Purple) |
| Accent | `#06B6D4` (Cyan) |
| Background | `#F8FAFC` |
| Text | `#0F172A` |
| Heading font | Poppins |
| Body font | Inter / Source Sans 3 |

---

## 🔐 Authentication

For demo purposes, any email (valid format) and password longer than 6 characters will sign you in. No backend required.

---

## 📝 Notes

- All resume data is stored in React context (in-memory)
- ATS scores are calculated client-side based on skill matching
- The AI chatbot provides pattern-matched responses (no API key required)
- PDF export uses browser `window.print()` — style your resume before printing
- Portfolio publishing is simulated (shows a generated URL)
