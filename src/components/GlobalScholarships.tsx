import React, { useState, useMemo } from 'react';
import { Scholarship, StudyLevel, FundingType, ExamRequirementType } from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Search,
  Filter,
  Globe,
  SlidersHorizontal,
  X,
  Building,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GlobalScholarshipsProps {
  scholarships: Scholarship[];
  savedScholarshipIds: Set<string>;
  onToggleSave: (scholarship: Scholarship) => void;
  onViewDetails: (scholarshipId: string) => void;
}

const QUICK_CHIPS = [
  'All Scholarships',
  'No Separate Exam',
  'Full Funding',
  'India Central',
  'Maharashtra State',
  'Japan (MEXT)',
  'Germany (DAAD)',
  'China (CSC)',
  'South Korea (GKS)',
  'United Kingdom (Chevening)',
  'Undergraduate',
  'Master\'s',
  'PhD'
];

export const GlobalScholarships: React.FC<GlobalScholarshipsProps> = ({
  scholarships,
  savedScholarshipIds,
  onToggleSave,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChip, setSelectedChip] = useState('All Scholarships');

  // Filters state
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStudyLevel, setSelectedStudyLevel] = useState<string>('All');
  const [selectedFundingType, setSelectedFundingType] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [selectedField, setSelectedField] = useState<string>('All');

  // Derive unique countries
  const countries = useMemo(() => {
    const set = new Set<string>();
    scholarships.forEach((s) => set.add(s.country));
    return ['All', ...Array.from(set).sort()];
  }, [scholarships]);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      // 1. Search query across name, provider, country, university, field, exam
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesCountry = s.country.toLowerCase().includes(q);
        const matchesUniv = s.university?.toLowerCase().includes(q) || false;
        const matchesField = s.fieldOfStudy.some((f) => f.toLowerCase().includes(q));
        const matchesExam =
          s.examRequirement.examName?.toLowerCase().includes(q) ||
          s.examRequirement.examType.toLowerCase().includes(q);

        if (!matchesName && !matchesProvider && !matchesCountry && !matchesUniv && !matchesField && !matchesExam) {
          return false;
        }
      }

      // 2. Quick chips
      if (selectedChip === 'No Separate Exam' && s.examRequirement.examType !== 'No separate exam required') {
        return false;
      }
      if (selectedChip === 'Full Funding' && s.fundingType !== 'Full Funding') {
        return false;
      }
      if (selectedChip === 'India Central' && (s.country !== 'India' || s.providerType !== 'Central Government')) {
        return false;
      }
      if (selectedChip === 'Maharashtra State' && (s.region !== 'Maharashtra' && !s.name.includes('Maharashtra'))) {
        return false;
      }
      if (selectedChip === 'Japan (MEXT)' && !s.name.includes('MEXT')) {
        return false;
      }
      if (selectedChip === 'Germany (DAAD)' && !s.name.includes('DAAD')) {
        return false;
      }
      if (selectedChip === 'China (CSC)' && !s.name.includes('CSC')) {
        return false;
      }
      if (selectedChip === 'South Korea (GKS)' && !s.name.includes('GKS')) {
        return false;
      }
      if (selectedChip === 'United Kingdom (Chevening)' && !s.name.includes('Chevening')) {
        return false;
      }
      if (selectedChip === 'Undergraduate' && !s.studyLevel.includes('Undergraduate')) {
        return false;
      }
      if (selectedChip === 'Master\'s' && !s.studyLevel.includes('Master\'s')) {
        return false;
      }
      if (selectedChip === 'PhD' && !s.studyLevel.includes('PhD')) {
        return false;
      }

      // 3. Dropdown Filters
      if (selectedCountry !== 'All' && s.country !== selectedCountry) {
        return false;
      }
      if (selectedStudyLevel !== 'All' && !s.studyLevel.includes(selectedStudyLevel as any)) {
        return false;
      }
      if (selectedFundingType !== 'All' && s.fundingType !== selectedFundingType) {
        return false;
      }
      if (selectedExamType !== 'All' && s.examRequirement.examType !== selectedExamType) {
        return false;
      }
      if (selectedField !== 'All' && !s.fieldOfStudy.includes(selectedField)) {
        return false;
      }

      return true;
    });
  }, [
    scholarships,
    searchTerm,
    selectedChip,
    selectedCountry,
    selectedStudyLevel,
    selectedFundingType,
    selectedExamType,
    selectedField
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedChip('All Scholarships');
    setSelectedCountry('All');
    setSelectedStudyLevel('All');
    setSelectedFundingType('All');
    setSelectedExamType('All');
    setSelectedField('All');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedChip !== 'All Scholarships' ||
    selectedCountry !== 'All' ||
    selectedStudyLevel !== 'All' ||
    selectedFundingType !== 'All' ||
    selectedExamType !== 'All' ||
    selectedField !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Directory Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
          <Globe className="w-3.5 h-3.5 text-neutral-300" />
          <span>Independent Worldwide Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Global Scholarships Directory</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
          Explore scholarships, government fellowships, and university grants worldwide independently of your personal student profile. Inspect verified eligibility rules, admission exams, and required documents.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by scholarship name, provider, country, university, exam (e.g. MEXT, DAAD, CSC, IELTS, Maharashtra)..."
          className="w-full bg-[#12131b] border border-white/10 rounded-2xl px-4 py-3.5 pl-12 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 shadow-lg"
        />
        <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-3.5 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {QUICK_CHIPS.map((chip) => {
          const isSelected = selectedChip === chip;
          return (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-mono whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white text-black border-white font-bold shadow'
                  : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-xl bg-[#12131b] border border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Country */}
        <div>
          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Study Level */}
        <div>
          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Study Level
          </label>
          <select
            value={selectedStudyLevel}
            onChange={(e) => setSelectedStudyLevel(e.target.value)}
            className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Master's">Master's</option>
            <option value="PhD">Doctorate / PhD</option>
            <option value="Diploma">Diploma / Polytechnic</option>
          </select>
        </div>

        {/* Funding Type */}
        <div>
          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Funding Type
          </label>
          <select
            value={selectedFundingType}
            onChange={(e) => setSelectedFundingType(e.target.value)}
            className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Funding Types</option>
            <option value="Full Funding">Full Funding (100% + Stipend)</option>
            <option value="Tuition Waiver">Tuition Waiver</option>
            <option value="Stipend / Grant">Stipend / Grant</option>
            <option value="Partial Funding">Partial Funding</option>
          </select>
        </div>

        {/* Exam Requirement */}
        <div>
          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Exam Requirement
          </label>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Exam Types</option>
            <option value="No separate exam required">No Separate Exam Required</option>
            <option value="Scholarship-specific exam required">Scholarship-Specific Exam</option>
            <option value="University admission examination">University Entrance Exam</option>
            <option value="Language proficiency test">Language Test (IELTS/TOEFL/HSK)</option>
            <option value="Depends on university/program">Depends on University</option>
          </select>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Academic Field
          </label>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Fields</option>
            <option value="Engineering & Technology">Engineering & Technology</option>
            <option value="Natural Sciences">Natural Sciences</option>
            <option value="Medicine & Health">Medicine & Health</option>
            <option value="Business & Economics">Business & Economics</option>
            <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
          </select>
        </div>
      </div>

      {/* Results header & clear filters */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400 font-mono">
          Showing <strong className="text-white">{filteredScholarships.length}</strong> of{' '}
          {scholarships.length} opportunities
        </span>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 font-mono"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredScholarships.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#12131b]">
          <BookOpen className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No scholarships match the selected criteria</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1">
            Try adjusting your search terms or relaxing specific exam/country filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              isSaved={savedScholarshipIds.has(s.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
