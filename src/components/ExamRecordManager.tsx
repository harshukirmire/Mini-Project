import React, { useState } from 'react';
import { ExamRecord, ExamCategory } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Award,
  Layers,
  FileText
} from 'lucide-react';

interface ExamRecordManagerProps {
  exams: ExamRecord[];
  onAddOrUpdate: (exam: Omit<ExamRecord, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (examId: string) => Promise<void>;
}

const COMMON_EXAMS: { name: string; category: ExamCategory }[] = [
  { name: 'JEE Main', category: 'National Entrance' },
  { name: 'JEE Advanced', category: 'National Entrance' },
  { name: 'NEET-UG', category: 'National Entrance' },
  { name: 'GATE', category: 'National Entrance' },
  { name: 'CUET-UG', category: 'National Entrance' },
  { name: 'CUET-PG', category: 'National Entrance' },
  { name: 'CLAT', category: 'National Entrance' },
  { name: 'NATA', category: 'National Entrance' },
  { name: 'MHT-CET PCM', category: 'State Entrance' },
  { name: 'MHT-CET PCB', category: 'State Entrance' },
  { name: 'KCET', category: 'State Entrance' },
  { name: 'AP EAMCET / EAPCET', category: 'State Entrance' },
  { name: 'TS EAMCET / EAPCET', category: 'State Entrance' },
  { name: 'WBJEE', category: 'State Entrance' },
  { name: 'GUJCET', category: 'State Entrance' },
  { name: 'CBSE Class 12 Board', category: 'Board Examination' },
  { name: 'ICSE / ISC Class 12 Board', category: 'Board Examination' },
  { name: 'Maharashtra State Board (HSC)', category: 'Board Examination' },
  { name: 'Other State Board (HSC)', category: 'Board Examination' },
  { name: 'IELTS Academic', category: 'Language & International' },
  { name: 'TOEFL iBT', category: 'Language & International' },
  { name: 'SAT', category: 'Language & International' },
  { name: 'GRE General', category: 'Language & International' },
  { name: 'GMAT', category: 'Language & International' },
  { name: 'HSK (Chinese)', category: 'Language & International' },
  { name: 'JLPT (Japanese)', category: 'Language & International' },
  { name: 'TOPIK (Korean)', category: 'Language & International' }
];

export const ExamRecordManager: React.FC<ExamRecordManagerProps> = ({
  exams,
  onAddOrUpdate,
  onDelete
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // Form states
  const [examName, setExamName] = useState('JEE Main');
  const [customExamName, setCustomExamName] = useState('');
  const [examCategory, setExamCategory] = useState<ExamCategory>('National Entrance');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [session, setSession] = useState('');
  const [score, setScore] = useState('');
  const [percentile, setPercentile] = useState('');
  const [rank, setRank] = useState('');
  const [marks, setMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [percentage, setPercentage] = useState('');
  const [board, setBoard] = useState('');
  const [stream, setStream] = useState('');
  const [paper, setPaper] = useState('');
  const [resultStatus, setResultStatus] = useState<ExamRecord['resultStatus']>('Announced');

  // Subscores for IELTS / TOEFL / etc.
  const [sectionScores, setSectionScores] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEditingExamId(null);
    setExamName('JEE Main');
    setCustomExamName('');
    setExamCategory('National Entrance');
    setYear(new Date().getFullYear());
    setSession('');
    setScore('');
    setPercentile('');
    setRank('');
    setMarks('');
    setTotalMarks('');
    setPercentage('');
    setBoard('');
    setStream('');
    setPaper('');
    setResultStatus('Announced');
    setSectionScores({});
    setNotes('');
  };

  const handleOpenAdd = (presetName?: string) => {
    resetForm();
    if (presetName) {
      const found = COMMON_EXAMS.find((e) => e.name === presetName);
      if (found) {
        setExamName(found.name);
        setExamCategory(found.category);
      }
    }
    setModalOpen(true);
  };

  const handleEdit = (exam: ExamRecord) => {
    setEditingExamId(exam.id);
    const isStandard = COMMON_EXAMS.some((e) => e.name === exam.examName);
    if (isStandard) {
      setExamName(exam.examName);
      setCustomExamName('');
    } else {
      setExamName('Custom / Other');
      setCustomExamName(exam.examName);
    }
    setExamCategory(exam.examCategory);
    setYear(exam.year);
    setSession(exam.session || '');
    setScore(exam.score !== undefined ? String(exam.score) : '');
    setPercentile(exam.percentile !== undefined ? String(exam.percentile) : '');
    setRank(exam.rank !== undefined ? String(exam.rank) : '');
    setMarks(exam.marks !== undefined ? String(exam.marks) : '');
    setTotalMarks(exam.totalMarks !== undefined ? String(exam.totalMarks) : '');
    setPercentage(exam.percentage !== undefined ? String(exam.percentage) : '');
    setBoard(exam.board || '');
    setStream(exam.stream || '');
    setPaper(exam.paper || '');
    setResultStatus(exam.resultStatus || 'Announced');
    setSectionScores(
      exam.sectionScores
        ? Object.fromEntries(
            Object.entries(exam.sectionScores).map(([k, v]) => [k, String(v)])
          )
        : {}
    );
    setNotes(exam.additionalNotes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const resolvedName = examName === 'Custom / Other' ? customExamName.trim() || 'Custom Exam' : examName;

    try {
      await onAddOrUpdate({
        id: editingExamId || undefined,
        examName: resolvedName,
        examCategory,
        year: Number(year),
        session: session.trim() || undefined,
        score: score ? (isNaN(Number(score)) ? score : Number(score)) : undefined,
        percentile: percentile ? parseFloat(percentile) : undefined,
        rank: rank ? rank.trim() : undefined,
        marks: marks ? (isNaN(Number(marks)) ? marks : Number(marks)) : undefined,
        totalMarks: totalMarks ? totalMarks : undefined,
        percentage: percentage ? parseFloat(percentage) : undefined,
        board: board ? board.trim() : undefined,
        stream: stream ? stream.trim() : undefined,
        paper: paper ? paper.trim() : undefined,
        resultStatus,
        sectionScores: Object.keys(sectionScores).length > 0 ? sectionScores : undefined,
        additionalNotes: notes.trim() || undefined
      });
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save exam:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolvedExamKey = examName === 'Custom / Other' ? customExamName : examName;

  return (
    <div className="space-y-6">
      {/* Header and Quick Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-neutral-300" /> Academic & Entrance Examinations Profile
          </h3>
          <p className="text-xs text-neutral-400">
            Maintain records of your national, state entrance, board, and international language scores.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Examination Record
        </button>
      </div>

      {/* Quick Select Chips for Common Exams */}
      <div>
        <p className="text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-wider">
          Quick Add Exam:
        </p>
        <div className="flex flex-wrap gap-2">
          {['JEE Main', 'MHT-CET PCM', 'NEET-UG', 'Maharashtra State Board (HSC)', 'GATE', 'IELTS Academic', 'CUET-UG'].map((preset) => {
            const hasExam = exams.some((e) => e.examName.toLowerCase().includes(preset.toLowerCase()));
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleOpenAdd(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1.5 ${
                  hasExam
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>+ {preset}</span>
                {hasExam && <span className="text-[9px] bg-emerald-500/20 px-1 rounded">Added</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exams Grid / Empty State */}
      {exams.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">
          <Layers className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-neutral-200">No examination records added yet</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Add exams such as JEE Main, MHT-CET, Board percentage, IELTS, or GATE so Synora can match entrance exam cut-offs.
          </p>
          <button
            onClick={() => handleOpenAdd('JEE Main')}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 shadow"
          >
            Add First Exam Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-xl border border-white/10 bg-[#12131b] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      {exam.examCategory} • {exam.year}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{exam.examName}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(exam)}
                      title="Edit Exam"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(exam.id)}
                      title="Delete Exam"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Score highlights */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.08] text-xs">
                  {exam.percentile !== undefined && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">PERCENTILE</span>
                      <span className="font-mono font-bold text-white">{exam.percentile}</span>
                    </div>
                  )}

                  {exam.rank !== undefined && exam.rank !== '' && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">ALL INDIA RANK</span>
                      <span className="font-mono font-bold text-white">{exam.rank}</span>
                    </div>
                  )}

                  {exam.score !== undefined && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">SCORE / BAND</span>
                      <span className="font-mono font-bold text-white">{exam.score}</span>
                    </div>
                  )}

                  {exam.percentage !== undefined && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">PERCENTAGE</span>
                      <span className="font-mono font-bold text-white">{exam.percentage}%</span>
                    </div>
                  )}

                  {exam.marks !== undefined && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">MARKS</span>
                      <span className="font-mono font-bold text-white">
                        {exam.marks} {exam.totalMarks ? `/ ${exam.totalMarks}` : ''}
                      </span>
                    </div>
                  )}

                  {exam.resultStatus && (
                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <span className="text-[10px] text-neutral-400 block font-mono">STATUS</span>
                      <span className="text-[11px] font-semibold text-neutral-300">
                        {exam.resultStatus}
                      </span>
                    </div>
                  )}
                </div>

                {/* Subscores if language exam */}
                {exam.sectionScores && Object.keys(exam.sectionScores).length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-wrap gap-2 text-[10px] font-mono text-neutral-400">
                    {Object.entries(exam.sectionScores).map(([sec, val]) => (
                      <span key={sec} className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {sec}: <strong className="text-white">{val}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Exam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#12131b] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingExamId ? 'Edit Examination Record' : 'Add Examination Record'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Select Exam */}
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  EXAMINATION NAME *
                </label>
                <select
                  value={examName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExamName(val);
                    const found = COMMON_EXAMS.find((c) => c.name === val);
                    if (found) setExamCategory(found.category);
                  }}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                >
                  <optgroup label="National Entrance Exams (India)">
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET-UG">NEET-UG</option>
                    <option value="GATE">GATE</option>
                    <option value="CUET-UG">CUET-UG</option>
                    <option value="CUET-PG">CUET-PG</option>
                    <option value="CLAT">CLAT</option>
                    <option value="NATA">NATA</option>
                  </optgroup>
                  <optgroup label="State Level Entrance Examinations">
                    <option value="MHT-CET PCM">MHT-CET PCM (Maharashtra)</option>
                    <option value="MHT-CET PCB">MHT-CET PCB (Maharashtra)</option>
                    <option value="KCET">KCET (Karnataka)</option>
                    <option value="AP EAMCET / EAPCET">AP EAMCET / EAPCET (Andhra Pradesh)</option>
                    <option value="TS EAMCET / EAPCET">TS EAMCET / EAPCET (Telangana)</option>
                    <option value="WBJEE">WBJEE (West Bengal)</option>
                    <option value="GUJCET">GUJCET (Gujarat)</option>
                  </optgroup>
                  <optgroup label="School / Board Examinations">
                    <option value="CBSE Class 12 Board">CBSE Class 12 Board</option>
                    <option value="ICSE / ISC Class 12 Board">ICSE / ISC Class 12 Board</option>
                    <option value="Maharashtra State Board (HSC)">Maharashtra State Board (HSC)</option>
                    <option value="Other State Board (HSC)">Other State Board (HSC)</option>
                  </optgroup>
                  <optgroup label="Language & International Exams">
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="TOEFL iBT">TOEFL iBT</option>
                    <option value="SAT">SAT</option>
                    <option value="GRE General">GRE General</option>
                    <option value="GMAT">GMAT</option>
                    <option value="HSK (Chinese)">HSK (Chinese Proficiency)</option>
                    <option value="JLPT (Japanese)">JLPT (Japanese Proficiency)</option>
                    <option value="TOPIK (Korean)">TOPIK (Korean Proficiency)</option>
                  </optgroup>
                  <optgroup label="Custom / Other">
                    <option value="Custom / Other">Other / Unlisted Examination</option>
                  </optgroup>
                </select>
              </div>

              {/* If Custom Exam, allow typing name and choosing category */}
              {examName === 'Custom / Other' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                      CUSTOM EXAM TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={customExamName}
                      onChange={(e) => setCustomExamName(e.target.value)}
                      placeholder="e.g. OJEE, KEAM, TestDaF"
                      className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                      EXAM CATEGORY
                    </label>
                    <select
                      value={examCategory}
                      onChange={(e) => setExamCategory(e.target.value as any)}
                      className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="National Entrance">National Entrance</option>
                      <option value="State Entrance">State Entrance</option>
                      <option value="Board Examination">Board Examination</option>
                      <option value="Language & International">Language & International</option>
                      <option value="University Entrance">University Entrance</option>
                      <option value="Scholarship Specific">Scholarship Specific</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Year & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    EXAM YEAR *
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    RESULT STATUS
                  </label>
                  <select
                    value={resultStatus}
                    onChange={(e) => setResultStatus(e.target.value as any)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Announced">Announced / Declared</option>
                    <option value="Awaiting Result">Awaiting Result</option>
                    <option value="Appearing">Appearing / Registered</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC FIELDS PER EXAM */}

              {/* 1. JEE Main Fields */}
              {resolvedExamKey.includes('JEE Main') && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    JEE Main Specific Fields
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        SESSION
                      </label>
                      <input
                        type="text"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        placeholder="Session 1 / Session 2"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        NTA PERCENTILE *
                      </label>
                      <input
                        type="number"
                        step="0.0000001"
                        value={percentile}
                        onChange={(e) => setPercentile(e.target.value)}
                        placeholder="97.4568192"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        ALL INDIA RANK (AIR)
                      </label>
                      <input
                        type="text"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="e.g. 18450"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MHT-CET PCM / PCB Fields */}
              {resolvedExamKey.includes('MHT-CET') && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    MHT-CET Specific Fields (Maharashtra)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        CET PERCENTILE *
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={percentile}
                        onChange={(e) => setPercentile(e.target.value)}
                        placeholder="94.85"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        RAW SCORE (OUT OF 200)
                      </label>
                      <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="145"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        STATE GENERAL MERIT RANK
                      </label>
                      <input
                        type="text"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="e.g. 8120"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. NEET Fields */}
              {resolvedExamKey.includes('NEET') && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    NEET-UG Fields
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        SCORE (OUT OF 720) *
                      </label>
                      <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="620"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        NEET PERCENTILE
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={percentile}
                        onChange={(e) => setPercentile(e.target.value)}
                        placeholder="98.2"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        ALL INDIA RANK
                      </label>
                      <input
                        type="text"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="e.g. 14200"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. GATE Fields */}
              {resolvedExamKey.includes('GATE') && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    GATE Specific Fields
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        PAPER / DISCIPLINE (e.g. CS, ME)
                      </label>
                      <input
                        type="text"
                        value={paper}
                        onChange={(e) => setPaper(e.target.value)}
                        placeholder="CS (Computer Science)"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        GATE SCORE (OUT OF 1000)
                      </label>
                      <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="680"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        MARKS (OUT OF 100)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="58.6"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Board Exam Fields */}
              {(resolvedExamKey.includes('Board') || resolvedExamKey.includes('HSC')) && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    Board Examination Marks
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        BOARD NAME
                      </label>
                      <input
                        type="text"
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        placeholder="Maharashtra State Board"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        STREAM (SCIENCE/COMMERCE/ARTS)
                      </label>
                      <input
                        type="text"
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        placeholder="Science (PCM)"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        OVERALL PERCENTAGE (%) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        placeholder="88.5"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. IELTS / TOEFL / Language Exam Fields */}
              {(resolvedExamKey.includes('IELTS') || resolvedExamKey.includes('TOEFL') || resolvedExamKey.includes('SAT')) && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                    Language / International Test Score
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        OVERALL BAND / TOTAL SCORE *
                      </label>
                      <input
                        type="text"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="e.g. 7.5 (IELTS) or 105 (TOEFL)"
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        TEST DATE
                      </label>
                      <input
                        type="date"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Section subscores for IELTS */}
                  {resolvedExamKey.includes('IELTS') && (
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.06]">
                      {['Listening', 'Reading', 'Writing', 'Speaking'].map((sec) => (
                        <div key={sec}>
                          <label className="block text-[10px] font-mono text-neutral-400">
                            {sec.toUpperCase()}
                          </label>
                          <input
                            type="text"
                            placeholder="7.0"
                            value={sectionScores[sec] || ''}
                            onChange={(e) =>
                              setSectionScores({ ...sectionScores, [sec]: e.target.value })
                            }
                            className="w-full bg-[#181924] border border-white/10 rounded p-1.5 text-xs text-white font-mono text-center"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Generic fallback score inputs for custom/other exams */}
              {!resolvedExamKey.includes('JEE Main') &&
                !resolvedExamKey.includes('MHT-CET') &&
                !resolvedExamKey.includes('NEET') &&
                !resolvedExamKey.includes('GATE') &&
                !resolvedExamKey.includes('Board') &&
                !resolvedExamKey.includes('HSC') &&
                !resolvedExamKey.includes('IELTS') &&
                !resolvedExamKey.includes('TOEFL') &&
                !resolvedExamKey.includes('SAT') && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="text-xs font-mono font-bold text-neutral-300 uppercase">
                      General Score & Ranking
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          SCORE / MARKS
                        </label>
                        <input
                          type="text"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          placeholder="e.g. 180"
                          className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          PERCENTILE
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={percentile}
                          onChange={(e) => setPercentile(e.target.value)}
                          placeholder="92.4"
                          className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                          RANK
                        </label>
                        <input
                          type="text"
                          value={rank}
                          onChange={(e) => setRank(e.target.value)}
                          placeholder="e.g. 1250"
                          className="w-full bg-[#181924] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{editingExamId ? 'Update Exam' : 'Save Exam Record'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
