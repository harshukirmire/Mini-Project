import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, ExamRecord, ApplicationRecord } from '../types';
import { askSynoraGuide } from '../lib/geminiService';
import {
  Sparkles,
  Send,
  User,
  Bot,
  HelpCircle,
  FileQuestion,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SynoraGuideProps {
  scholarships: Scholarship[];
  exams: ExamRecord[];
  applications: ApplicationRecord[];
  activeScholarship?: Scholarship | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'What documents are required for MEXT Japanese government scholarship?',
  'Does Central Sector Scheme (PM-USP) require a separate national entrance exam?',
  'Explain the eligibility criteria for Maharashtra EBC fee reimbursement.',
  'What is the difference between IELTS requirement and scholarship examination?',
  'What are my upcoming deadlines based on my active tracker?'
];

export const SynoraGuide: React.FC<SynoraGuideProps> = ({
  scholarships,
  exams,
  applications,
  activeScholarship
}) => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am Synora Guide AI. I provide factual, verified insights into scholarship eligibility, entrance exam rules, document checklists, and application procedures without fabricating deadlines or requirements. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askSynoraGuide(q.trim(), {
        studentProfile: userProfile,
        examRecords: exams,
        applications,
        activeScholarship: activeScholarship || scholarships[0]
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I was unable to retrieve verified information right now. Please verify requirements directly from the official scholarship portals.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Factual & Grounded Scholarship Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Synora Guide AI</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
          Ask questions about exam criteria, eligibility thresholds, required marksheets, and official timelines.
          Synora Guide enforces strict zero-fabrication rules.
        </p>
      </div>

      {/* Suggested prompts */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
          Recommended Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 text-left transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-[#12131b] border border-white/10 rounded-2xl flex flex-col h-[520px] shadow-2xl overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-neutral-800 text-white border border-white/20'
                      : 'bg-white text-black shadow-sm'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-white text-black font-medium'
                      : 'bg-[#181924] border border-white/10 text-neutral-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isUser ? 'text-neutral-600 text-right' : 'text-neutral-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-[#181924] border border-white/10 rounded-2xl p-3.5 text-xs text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse delay-200" />
                <span className="font-mono text-[11px] ml-1">Consulting verified scholarship criteria...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about required exams, documents, deadlines, or procedure..."
              className="flex-1 bg-[#181924] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Anti-hallucination verified model
            </span>
            <span>Does not invent unverified official links</span>
          </div>
        </div>
      </div>
    </div>
  );
};
