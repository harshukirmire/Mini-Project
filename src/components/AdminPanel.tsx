import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, VerificationStatus, FundingType, ExamRequirementType } from '../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Save,
  X
} from 'lucide-react';

interface AdminPanelProps {
  scholarships: Scholarship[];
  onUpsertScholarship: (s: Scholarship) => Promise<void>;
  onDeleteScholarship: (id: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  scholarships,
  onUpsertScholarship,
  onDeleteScholarship
}) => {
  const { isAdmin, currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [providerType, setProviderType] = useState<Scholarship['providerType']>('Central Government');
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('');
  const [fundingType, setFundingType] = useState<FundingType>('Full Funding');
  const [fundingDesc, setFundingDesc] = useState('');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [studyLevels, setStudyLevels] = useState<string[]>(['Undergraduate']);
  const [examType, setExamType] = useState<ExamRequirementType>('No separate exam required');
  const [examName, setExamName] = useState('');
  const [minScore, setMinScore] = useState('');
  const [examWebsite, setExamWebsite] = useState('');
  const [criteriaSummary, setCriteriaSummary] = useState('');
  const [maxIncome, setMaxIncome] = useState('');
  const [minPercentage, setMinPercentage] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('Verified');
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="p-8 rounded-2xl bg-[#12131b] border border-white/10 shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-neutral-400 mt-2">
            You must be an authorized admin user ({currentUser?.email}) to edit public verified scholarship records or modify verification statuses.
          </p>
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setProvider('');
    setProviderType('Central Government');
    setCountry('India');
    setRegion('');
    setFundingType('Full Funding');
    setFundingDesc('');
    setDeadline('2026-12-31');
    setStudyLevels(['Undergraduate']);
    setExamType('No separate exam required');
    setExamName('');
    setMinScore('');
    setExamWebsite('');
    setCriteriaSummary('');
    setMaxIncome('');
    setMinPercentage('');
    setOfficialWebsite('');
    setPortalUrl('');
    setStatus('Verified');
    setModalOpen(true);
  };

  const handleEdit = (s: Scholarship) => {
    setEditingId(s.id);
    setName(s.name);
    setProvider(s.provider);
    setProviderType(s.providerType);
    setCountry(s.country);
    setRegion(s.region || '');
    setFundingType(s.fundingType);
    setFundingDesc(s.fundingAmountDescription);
    setDeadline(s.deadline);
    setStudyLevels(s.studyLevel as string[]);
    setExamType(s.examRequirement.examType);
    setExamName(s.examRequirement.examName || '');
    setMinScore(s.examRequirement.minimumScore || '');
    setExamWebsite(s.examRequirement.officialExamWebsite || '');
    setCriteriaSummary(s.eligibility.criteriaSummary);
    setMaxIncome(s.eligibility.maxFamilyIncomeINR ? String(s.eligibility.maxFamilyIncomeINR) : '');
    setMinPercentage(s.eligibility.minPercentage ? String(s.eligibility.minPercentage) : '');
    setOfficialWebsite(s.officialWebsite);
    setPortalUrl(s.officialApplicationPortal || '');
    setStatus(s.verificationStatus);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const existing = scholarships.find((s) => s.id === editingId);
      const scholarshipObj: Scholarship = {
        id: editingId || `custom-${Date.now()}`,
        name: name.trim(),
        provider: provider.trim(),
        providerType,
        country: country.trim(),
        region: region.trim() || undefined,
        studyLevel: studyLevels as any,
        fieldOfStudy: existing?.fieldOfStudy || ['All Fields'],
        fundingType,
        fundingAmountDescription: fundingDesc.trim() || 'Verified grant terms',
        deadline,
        isDeadlineVerified: true,
        eligibility: {
          criteriaSummary: criteriaSummary.trim() || 'Refer to official scheme brochure.',
          educationLevels: studyLevels,
          maxFamilyIncomeINR: maxIncome ? parseFloat(maxIncome) : undefined,
          minPercentage: minPercentage ? parseFloat(minPercentage) : undefined
        },
        examRequirement: {
          examType,
          examName: examName.trim() || undefined,
          minimumScore: minScore.trim() || undefined,
          officialExamWebsite: examWebsite.trim() || undefined
        },
        documents: existing?.documents || [
          { id: '1', name: 'Identity Proof / Aadhaar', required: true },
          { id: '2', name: 'Academic Marksheet', required: true }
        ],
        procedure: existing?.procedure || [
          { stepNumber: 1, title: 'Portal Registration', description: 'Create applicant account on official portal.' },
          { stepNumber: 2, title: 'Document Upload & Submission', description: 'Upload credentials and submit.' }
        ],
        officialWebsite: officialWebsite.trim() || 'https://scholarships.gov.in',
        officialApplicationPortal: portalUrl.trim() || undefined,
        verificationStatus: status,
        lastVerifiedDate: new Date().toISOString().split('T')[0],
        verifiedBy: currentUser?.email || 'Admin',
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onUpsertScholarship(scholarshipObj);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save scholarship:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Administrative Control & Content Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scholarship Verification & Management</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Publish verified programs, audit official URLs, and manage database records.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Verified Scholarship
        </button>
      </div>

      {/* Scholarships Inventory Table */}
      <div className="bg-[#12131b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] border-b border-white/[0.08] text-neutral-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Scholarship Name</th>
                <th className="py-3 px-4">Country & Provider</th>
                <th className="py-3 px-4">Exam Requirement</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-neutral-300">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block max-w-sm truncate">{s.name}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">{s.id}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white block font-medium">{s.country}</span>
                    <span className="text-[11px] text-neutral-400 truncate block max-w-[200px]">
                      {s.provider}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-neutral-300 block">{s.examRequirement.examType}</span>
                    <span className="text-neutral-500">{s.examRequirement.examName || 'None'}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">{s.deadline}</td>

                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        s.verificationStatus === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {s.verificationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(s)}
                        className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                        title="Edit scholarship"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteScholarship(s.id)}
                        className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete scholarship"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upsert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#12131b] border border-white/15 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Scholarship Program' : 'Add New Verified Scholarship'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-neutral-300 font-mono mb-1">SCHOLARSHIP NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">PROVIDER *</label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">PROVIDER TYPE</label>
                  <select
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value as any)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="Central Government">Central Government</option>
                    <option value="State Government">State Government</option>
                    <option value="International Government">International Government</option>
                    <option value="University">University</option>
                    <option value="Foundation / NGO">Foundation / NGO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">COUNTRY</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">DEADLINE (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-mono mb-1">EXAM REQUIREMENT TYPE</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  <option value="No separate exam required">No separate exam required</option>
                  <option value="Scholarship-specific exam required">Scholarship-specific exam required</option>
                  <option value="University admission examination">University admission examination</option>
                  <option value="Language proficiency test">Language proficiency test</option>
                  <option value="Depends on university/program">Depends on university/program</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">EXAM NAME (IF ANY)</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. MHT-CET PCM / IELTS"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">MINIMUM SCORE CUT-OFF</label>
                  <input
                    type="text"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    placeholder="e.g. Band 6.5 or CAP positive rank"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">OFFICIAL WEBSITE URL</label>
                  <input
                    type="url"
                    required
                    value={officialWebsite}
                    onChange={(e) => setOfficialWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-mono mb-1">APPLICATION PORTAL URL</label>
                  <input
                    type="url"
                    value={portalUrl}
                    onChange={(e) => setPortalUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-mono mb-1">ELIGIBILITY SUMMARY</label>
                <textarea
                  rows={2}
                  value={criteriaSummary}
                  onChange={(e) => setCriteriaSummary(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200"
                >
                  {saving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
