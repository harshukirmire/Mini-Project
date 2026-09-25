import React, { useState } from 'react';
import { ExamDirectoryItem, ExamCategory } from '../types';
import {
  GraduationCap,
  Search,
  ExternalLink,
  BookOpen,
  Calendar,
  Globe2,
  FileText,
  Award,
  Layers
} from 'lucide-react';

interface ExamDirectoryProps {
  exams: ExamDirectoryItem[];
  onSelectProgram?: (programName: string) => void;
}

export const ExamDirectory: React.FC<ExamDirectoryProps> = ({ exams, onSelectProgram }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  const categories = ['All', 'National Entrance', 'State Entrance', 'Language & International', 'Board Examination'];

  const filteredExams = exams.filter((e) => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q) || e.shortName.toLowerCase().includes(q);
      const matchPurpose = e.purpose.toLowerCase().includes(q);
      const matchRegion = e.countryOrRegion.toLowerCase().includes(q);
      const matchPrograms = e.relatedPrograms.some((p) => p.toLowerCase().includes(q));
      if (!matchName && !matchPurpose && !matchRegion && !matchPrograms) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
          <GraduationCap className="w-4 h-4 text-neutral-300" />
          <span>Independent Examination Reference Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Examination Directory</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
          Explore examinations associated with scholarship programs, admission criteria, and university grants.
          Understand conducting bodies, test structures, who takes each exam, and official verified websites.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exams (e.g. IELTS, MHT-CET, JEE Main, HSK, GATE, NEET)..."
            className="w-full bg-[#12131b] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow'
                  : 'bg-white/[0.04] text-neutral-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => {
          const isExpanded = expandedExamId === exam.id;
          return (
            <div
              key={exam.id}
              className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                      {exam.category} • {exam.countryOrRegion}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                      <span>{exam.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                        {exam.shortName}
                      </span>
                    </h3>
                  </div>

                  <a
                    href={exam.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Official Portal"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Conducting Body: <span className="text-neutral-300">{exam.conductingBody}</span>
                </p>

                {/* Purpose */}
                <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block font-semibold uppercase">
                      Purpose & Evaluation
                    </span>
                    <p className="text-neutral-300 mt-0.5 leading-relaxed">{exam.purpose}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block font-semibold uppercase">
                      Who Generally Takes It
                    </span>
                    <p className="text-neutral-300 mt-0.5 leading-relaxed">{exam.whoTakesIt}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block font-semibold uppercase">
                      Exam Format & Structure
                    </span>
                    <p className="text-neutral-300 mt-0.5 leading-relaxed">{exam.examStructureSummary}</p>
                  </div>

                  {exam.keyDatesInfo && (
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2 text-neutral-400">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{exam.keyDatesInfo}</span>
                    </div>
                  )}

                  {/* Related scholarships */}
                  <div>
                    <span className="text-[11px] font-mono text-neutral-400 block font-semibold uppercase mb-1.5">
                      Associated Scholarships / Programs
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exam.relatedPrograms.map((prog, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 font-mono"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Link footer */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-neutral-400" /> Verified Official Source
                </span>

                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline underline-offset-4"
                >
                  Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
