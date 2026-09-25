import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, ExamRecord, SavedScholarshipRecord, ApplicationRecord } from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Compass,
  BookmarkCheck,
  ClipboardList,
  Calendar,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  scholarships: Scholarship[];
  exams: ExamRecord[];
  saved: SavedScholarshipRecord[];
  applications: ApplicationRecord[];
  savedScholarshipIds: Set<string>;
  onToggleSave: (s: Scholarship) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  scholarships,
  exams,
  saved,
  applications,
  savedScholarshipIds,
  onToggleSave,
  onViewDetails,
  onNavigate
}) => {
  const { userProfile, currentUser } = useAuth();

  // Metrics
  const upcomingDeadlinesCount = saved.filter((s) => {
    if (s.deadline === 'Rolling') return false;
    const diff = new Date(s.deadline).getTime() - new Date().getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const activeApplicationsCount = applications.filter(
    (a) => a.status === 'In Progress' || a.status === 'Submitted' || a.status === 'Planning'
  ).length;

  const featuredScholarships = scholarships.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Card */}
      <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
            Student Intelligence Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {userProfile?.fullName || currentUser?.email?.split('@')[0] || 'Scholar'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            Discover verified scholarships, track examination requirements, and manage application milestones from a unified platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('find-for-me')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow transition-all"
            >
              <Search className="w-3.5 h-3.5" /> Run "Find For Me" Match
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask Synora AI Guide
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('saved')}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Saved</span>
              <BookmarkCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-mono font-bold text-white">{saved.length}</div>
            <span className="text-[10px] text-neutral-400">Shortlisted opportunities</span>
          </div>

          <div
            onClick={() => onNavigate('tracker')}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Tracker</span>
              <ClipboardList className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-mono font-bold text-white">{activeApplicationsCount}</div>
            <span className="text-[10px] text-neutral-400">Active applications</span>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Exam Profile</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-mono font-bold text-white">{exams.length}</div>
            <span className="text-[10px] text-neutral-400">Exams recorded</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider">Upcoming &lt;30d</span>
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-mono font-bold text-white">{upcomingDeadlinesCount}</div>
            <span className="text-[10px] text-neutral-400">Urgent deadlines</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Scholarships + Exam Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Featured Scholarships */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-neutral-300" /> Featured Verified Opportunities
            </h2>
            <button
              onClick={() => onNavigate('global-scholarships')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              View Global Directory <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredScholarships.map((s) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                isSaved={savedScholarshipIds.has(s.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Right Col: Student Academic Snapshot & Exam Checklist */}
        <div className="space-y-6">
          {/* Exam Summary Box */}
          <div className="bg-[#12131b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-neutral-400" /> Exam Portfolio
              </h3>
              <button
                onClick={() => onNavigate('profile')}
                className="text-[11px] text-neutral-300 hover:text-white underline font-mono"
              >
                + Add Exam
              </button>
            </div>

            {exams.length === 0 ? (
              <div className="text-center py-4 text-neutral-400 text-xs">
                <p>No exams logged yet.</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Add JEE, MHT-CET, NEET, GATE, or IELTS to match cut-offs.
                </p>
                <button
                  onClick={() => onNavigate('profile')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
                >
                  Configure Exams
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {exams.slice(0, 4).map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{ex.examName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {ex.year} • {ex.examCategory}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      {ex.percentile ? (
                        <span className="text-white font-bold">{ex.percentile}%ile</span>
                      ) : ex.score ? (
                        <span className="text-white font-bold">{ex.score}</span>
                      ) : ex.percentage ? (
                        <span className="text-white font-bold">{ex.percentage}%</span>
                      ) : (
                        <span className="text-neutral-400">{ex.resultStatus || 'Appeared'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="bg-[#12131b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" /> Saved Deadlines
            </h3>

            {saved.length === 0 ? (
              <p className="text-xs text-neutral-400 py-2">
                No scholarships saved yet. Save items from the directory to track deadlines here.
              </p>
            ) : (
              <div className="space-y-2">
                {saved.slice(0, 3).map((item) => (
                  <div
                    key={item.scholarshipId}
                    onClick={() => onViewDetails(item.scholarshipId)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-white text-xs block truncate">
                      {item.scholarshipName}
                    </span>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mt-1">
                      <span>{item.country}</span>
                      <span className="text-neutral-300">{item.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
