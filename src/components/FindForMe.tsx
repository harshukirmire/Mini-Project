import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, ExamRecord } from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import { evaluateScholarshipMatch } from '../lib/matchingEngine';
import {
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface FindForMeProps {
  scholarships: Scholarship[];
  exams: ExamRecord[];
  savedScholarshipIds: Set<string>;
  onToggleSave: (scholarship: Scholarship) => void;
  onViewDetails: (scholarshipId: string) => void;
  onNavigateToProfile: () => void;
}

export const FindForMe: React.FC<FindForMeProps> = ({
  scholarships,
  exams,
  savedScholarshipIds,
  onToggleSave,
  onViewDetails,
  onNavigateToProfile
}) => {
  const { userProfile } = useAuth();
  const [filterTier, setFilterTier] = useState<'all' | 'high' | 'potential'>('all');

  const matchResults = useMemo(() => {
    return scholarships.map((s) => evaluateScholarshipMatch(s, userProfile, exams));
  }, [scholarships, userProfile, exams]);

  const sortedAndFiltered = useMemo(() => {
    let list = [...matchResults];

    if (filterTier === 'high') {
      list = list.filter((r) => r.status === 'High Match');
    } else if (filterTier === 'potential') {
      list = list.filter((r) => r.status === 'Potential Match' || r.status === 'High Match');
    }

    // Sort by match score descending
    return list.sort((a, b) => b.matchScore - a.matchScore);
  }, [matchResults, filterTier]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-neutral-200 text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Rule-Based Eligibility Matching Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find For Me — Personalized Scholarship Matching
          </h1>

          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            Synora compares your academic status ({userProfile?.currentEducationLevel || 'Not set'}), domicile ({userProfile?.domicileState || userProfile?.state || 'Not set'}), annual income, and entrance examination attempts against verified eligibility guidelines.
          </p>

          {/* Legal / Audit Disclaimer */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs text-neutral-300">
            <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Matching scores indicate that your profile <em>potentially matches the listed criteria</em>. Official eligibility and selection can only be determined by the respective government department, university, or scholarship authority.
            </span>
          </div>
        </div>

        {/* Profile Snapshot bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-neutral-400">
            <span>
              Level: <strong className="text-white">{userProfile?.currentEducationLevel || 'Not set'}</strong>
            </span>
            <span>•</span>
            <span>
              Domicile: <strong className="text-white">{userProfile?.domicileState || userProfile?.state || 'Not set'}</strong>
            </span>
            <span>•</span>
            <span>
              Income: <strong className="text-white">{userProfile?.familyAnnualIncome ? `₹${userProfile.familyAnnualIncome.toLocaleString()}` : 'Not declared'}</strong>
            </span>
            <span>•</span>
            <span>
              Exam Records: <strong className="text-white">{exams.length} logged</strong>
            </span>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 flex items-center gap-1 font-sans font-semibold"
          >
            Update Profile Criteria <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTier === 'all'
                ? 'bg-white text-black shadow'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            All Potential Matches ({matchResults.length})
          </button>
          <button
            onClick={() => setFilterTier('high')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTier === 'high'
                ? 'bg-white text-black shadow'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            High Match (&gt;= 75%)
          </button>
        </div>

        <span className="text-xs font-mono text-neutral-400">
          Showing {sortedAndFiltered.length} opportunities
        </span>
      </div>

      {/* Scholarship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFiltered.map(({ scholarship, matchScore, reasons }) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            isSaved={savedScholarshipIds.has(scholarship.id)}
            onToggleSave={onToggleSave}
            onViewDetails={onViewDetails}
            showMatchScore={true}
            matchScorePercentage={matchScore}
            matchReasons={reasons}
          />
        ))}
      </div>
    </div>
  );
};
