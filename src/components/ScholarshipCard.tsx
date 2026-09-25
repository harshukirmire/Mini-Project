import React from 'react';
import { Scholarship, ExamRequirementType } from '../types';
import {
  Calendar,
  Building,
  GraduationCap,
  Globe,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved?: boolean;
  onToggleSave?: (scholarship: Scholarship) => void;
  onViewDetails?: (scholarshipId: string) => void;
  showMatchScore?: boolean;
  matchScorePercentage?: number;
  matchReasons?: { passed: string[]; missing: string[] };
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  showMatchScore = false,
  matchScorePercentage,
  matchReasons
}) => {
  const getExamBadge = (type: ExamRequirementType) => {
    switch (type) {
      case 'Scholarship-specific exam required':
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/20',
          label: 'Specific Exam Required'
        };
      case 'University admission examination':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          label: 'Admission Exam Required'
        };
      case 'Language proficiency test':
        return {
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
          label: 'Language Test (IELTS/HSK)'
        };
      case 'No separate exam required':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          label: 'No Separate Exam'
        };
      case 'Depends on university/program':
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          label: 'Depends on University'
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          label: 'Requirement Unverified'
        };
    }
  };

  const examBadge = getExamBadge(scholarship.examRequirement.examType);

  const isExpired =
    scholarship.deadline !== 'Rolling' &&
    new Date(scholarship.deadline).getTime() < new Date().getTime();

  return (
    <div className="group relative bg-[#13141c] hover:bg-[#161822] rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/40">
      {/* Top Banner / Match Info if from Find For Me */}
      {showMatchScore && matchScorePercentage !== undefined && (
        <div className="bg-white/[0.04] border-b border-white/[0.08] px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Profile Match Estimate</span>
          </div>
          <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
            {matchScorePercentage}% Match
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
              <Globe className="w-3 h-3 text-neutral-400" />
              {scholarship.country}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-400">
              {scholarship.providerType}
            </span>
            {scholarship.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(scholarship);
              }}
              title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-black" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        <h3
          onClick={() => onViewDetails && onViewDetails(scholarship.id)}
          className="text-base font-bold text-white leading-snug line-clamp-2 hover:text-neutral-200 cursor-pointer group-hover:underline underline-offset-2"
        >
          {scholarship.name}
        </h3>

        <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-medium flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          {scholarship.provider}
        </p>
      </div>

      {/* Meta Highlights */}
      <div className="px-5 py-2 space-y-2 text-xs">
        {/* Funding badge */}
        <div className="flex items-center justify-between py-1 border-t border-white/[0.06]">
          <span className="text-neutral-400">Funding</span>
          <span className="font-semibold text-neutral-200 text-right truncate max-w-[200px]" title={scholarship.fundingAmountDescription}>
            {scholarship.fundingType}
          </span>
        </div>

        {/* Study Level */}
        <div className="flex items-center justify-between py-1 border-t border-white/[0.06]">
          <span className="text-neutral-400">Study Level</span>
          <span className="font-medium text-neutral-300 text-right truncate max-w-[200px]">
            {scholarship.studyLevel.join(', ')}
          </span>
        </div>

        {/* Exam requirement section - Prominent & distinguished */}
        <div className="py-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
              Exam Required
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${examBadge.bg}`}>
              {examBadge.label}
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 font-mono line-clamp-1">
            {scholarship.examRequirement.examName || scholarship.examRequirement.examType}
          </p>
        </div>

        {/* Match reasons breakdown if in Find For Me */}
        {showMatchScore && matchReasons && (
          <div className="py-2 border-t border-white/[0.06] space-y-1">
            {matchReasons.passed.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{item}</span>
              </p>
            ))}
            {matchReasons.missing.slice(0, 1).map((item, idx) => (
              <p key={idx} className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="truncate">{item}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className={isExpired ? 'text-red-400 line-through' : 'font-mono text-neutral-300'}>
            {scholarship.deadline}
          </span>
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(scholarship.id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
