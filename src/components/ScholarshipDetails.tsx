import React, { useState } from 'react';
import { Scholarship, ApplicationRecord } from '../types';
import {
  ArrowLeft,
  Building,
  Globe2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  ListOrdered,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ClipboardList,
  Sparkles,
  ShieldCheck,
  Clock,
  Award
} from 'lucide-react';

interface ScholarshipDetailsProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (s: Scholarship) => void;
  onBack: () => void;
  onStartTracking: (s: Scholarship) => void;
  onAskAIAboutScholarship: (s: Scholarship) => void;
}

export const ScholarshipDetails: React.FC<ScholarshipDetailsProps> = ({
  scholarship,
  isSaved,
  onToggleSave,
  onBack,
  onStartTracking,
  onAskAIAboutScholarship
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'exam' | 'documents' | 'procedure'>('overview');

  const getExamBadge = (type: string) => {
    switch (type) {
      case 'Scholarship-specific exam required':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'University admission examination':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Language proficiency test':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'No separate exam required':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back button & action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAIAboutScholarship(scholarship)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-semibold border border-white/15 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-200" /> Ask Synora AI
          </button>

          <button
            onClick={() => onToggleSave(scholarship)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-white text-black border-white shadow'
                : 'bg-white/[0.03] text-neutral-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved in List' : 'Save Scholarship'}</span>
          </button>

          <button
            onClick={() => onStartTracking(scholarship)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow transition-all"
          >
            <ClipboardList className="w-3.5 h-3.5" /> Start Tracking
          </button>
        </div>
      </div>

      {/* Hero Header Box */}
      <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1.5">
            <Globe2 className="w-3 h-3 text-neutral-400" />
            {scholarship.country} {scholarship.region ? `(${scholarship.region})` : ''}
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400">
            {scholarship.providerType}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> {scholarship.verificationStatus}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            Last Verified: {scholarship.lastVerifiedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {scholarship.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-neutral-400" />
            <span>{scholarship.provider}</span>
          </div>

          {scholarship.university && (
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-neutral-400" />
              <span>{scholarship.university}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono text-neutral-300">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>Deadline: <strong className="text-white">{scholarship.deadline}</strong></span>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              Funding Coverage
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">{scholarship.fundingType}</span>
            <span className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
              {scholarship.fundingAmountDescription}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              Study Level & Duration
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {scholarship.studyLevel.join(', ')}
            </span>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              {scholarship.duration || 'Standard course duration'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              Exam Requirement
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block mt-1 ${getExamBadge(scholarship.examRequirement.examType)}`}>
              {scholarship.examRequirement.examType}
            </span>
            <span className="text-[11px] text-neutral-300 block mt-1 truncate">
              {scholarship.examRequirement.examName || 'No separate exam'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'overview', label: 'Eligibility & Criteria' },
          { id: 'exam', label: 'Exam Requirement (Important)' },
          { id: 'documents', label: `Required Documents (${scholarship.documents.length})` },
          { id: 'procedure', label: `Application Procedure (${scholarship.procedure.length} Steps)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-black shadow font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & ELIGIBILITY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Official Eligibility Breakdown</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {scholarship.eligibility.criteriaSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                {scholarship.eligibility.maxFamilyIncomeINR && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400 block font-mono text-[10px]">INCOME CEILING</span>
                    <span className="font-semibold text-white">
                      ₹{scholarship.eligibility.maxFamilyIncomeINR.toLocaleString('en-IN')} / year
                    </span>
                  </div>
                )}

                {scholarship.eligibility.minPercentage && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400 block font-mono text-[10px]">MINIMUM PERCENTAGE</span>
                    <span className="font-semibold text-white">
                      {scholarship.eligibility.minPercentage}% in qualifying degree/board
                    </span>
                  </div>
                )}

                {scholarship.eligibility.eligibleStates && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 sm:col-span-2">
                    <span className="text-neutral-400 block font-mono text-[10px]">DOMICILE / REGIONAL RESTRICTION</span>
                    <span className="font-semibold text-white">
                      {scholarship.eligibility.eligibleStates.join(', ')}
                    </span>
                  </div>
                )}

                {scholarship.eligibility.eligibleNationalities && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 sm:col-span-2">
                    <span className="text-neutral-400 block font-mono text-[10px]">ELIGIBLE NATIONALITIES</span>
                    <span className="font-semibold text-white">
                      {scholarship.eligibility.eligibleNationalities.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Field of study */}
            <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white">Eligible Fields & Degrees</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship.fieldOfStudy.map((f, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 text-neutral-200 border border-white/10 font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar: Official Verified Links */}
          <div className="space-y-6">
            <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-neutral-400" /> Verified Official Links
              </h3>
              <p className="text-[11px] text-neutral-400">
                Synora links strictly to government, council, or university web domains. Unofficial portals are never listed.
              </p>

              <div className="space-y-2 pt-2">
                <a
                  href={scholarship.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all group"
                >
                  <span className="truncate">Official Scholarship Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0 ml-2" />
                </a>

                {scholarship.officialApplicationPortal && (
                  <a
                    href={scholarship.officialApplicationPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all group shadow"
                  >
                    <span className="truncate">Official Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-black shrink-0 ml-2" />
                  </a>
                )}

                {scholarship.officialNotificationUrl && (
                  <a
                    href={scholarship.officialNotificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all group"
                  >
                    <span className="truncate">Official Guidelines Document</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0 ml-2" />
                  </a>
                )}
              </div>
            </div>

            {/* Application Tracker CTA */}
            <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-neutral-400" /> Apply & Track
              </h3>
              <p className="text-xs text-neutral-400">
                Planning to apply? Add this to your Synora Application Tracker to maintain dates, documents, and reference IDs.
              </p>
              <button
                onClick={() => onStartTracking(scholarship)}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors shadow"
              >
                Add to Application Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXAM REQUIREMENT SECTION - EXTREMELY DETAILED */}
      {activeTab === 'exam' && (
        <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Exam Classification
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {scholarship.examRequirement.examName || scholarship.examRequirement.examType}
              </h3>
            </div>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-lg border font-semibold ${getExamBadge(
                scholarship.examRequirement.examType
              )}`}
            >
              {scholarship.examRequirement.examType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <h4 className="font-mono text-neutral-400 font-semibold uppercase text-[11px]">
                  Purpose & Role in Selection
                </h4>
                <p className="text-neutral-200 mt-1 leading-relaxed text-sm">
                  {scholarship.examRequirement.purpose || 'Evaluation role defined per official guidelines.'}
                </p>
              </div>

              {scholarship.examRequirement.minimumScore && (
                <div>
                  <h4 className="font-mono text-neutral-400 font-semibold uppercase text-[11px]">
                    Minimum Cut-Off / Benchmark
                  </h4>
                  <p className="text-white mt-1 font-mono text-sm font-semibold">
                    {scholarship.examRequirement.minimumScore}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-mono text-neutral-400 font-semibold uppercase text-[11px]">
                  Official Verification Notes
                </h4>
                <p className="text-neutral-300 mt-1 leading-relaxed">
                  {scholarship.examRequirement.notes ||
                    'Please consult the official brochure to check year-specific syllabus and session dates.'}
                </p>
              </div>

              {scholarship.examRequirement.officialExamWebsite && (
                <div>
                  <h4 className="font-mono text-neutral-400 font-semibold uppercase text-[11px]">
                    Official Exam Portal
                  </h4>
                  <a
                    href={scholarship.examRequirement.officialExamWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white hover:underline underline-offset-4 flex items-center gap-1.5 mt-1 font-mono"
                  >
                    <span>{scholarship.examRequirement.officialExamWebsite}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. REQUIRED DOCUMENTS CHECKLIST */}
      {activeTab === 'documents' && (
        <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Mandatory & Supporting Document Checklist</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Prepare scanned PDF copies in advance before opening the official submission portal.
            </p>
          </div>

          <div className="divide-y divide-white/[0.08] mt-4">
            {scholarship.documents.map((doc, idx) => (
              <div key={doc.id || idx} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-1 rounded bg-white/5 border border-white/10 text-neutral-400 shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block">{doc.name}</span>
                    {doc.notes && <span className="text-xs text-neutral-400 block mt-0.5">{doc.notes}</span>}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 ${
                    doc.required
                      ? 'bg-red-500/10 text-red-300 border-red-500/20'
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}
                >
                  {doc.required ? 'Mandatory' : 'Optional / If applicable'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. STRUCTURED APPLICATION PROCEDURE */}
      {activeTab === 'procedure' && (
        <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Official Step-by-Step Application Procedure</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Follow this structured sequence to complete institutional verification and final submission.
            </p>
          </div>

          <div className="space-y-4">
            {scholarship.procedure.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0">
                  {step.stepNumber}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
