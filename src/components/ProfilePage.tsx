import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, ExamRecord } from '../types';
import { saveUserProfile } from '../lib/dbService';
import { ExamRecordManager } from './ExamRecordManager';
import {
  User,
  GraduationCap,
  Shield,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ProfilePageProps {
  exams: ExamRecord[];
  onAddOrUpdateExam: (exam: Omit<ExamRecord, 'id'> & { id?: string }) => Promise<void>;
  onDeleteExam: (examId: string) => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  exams,
  onAddOrUpdateExam,
  onDeleteExam
}) => {
  const { currentUser, userProfile, refreshProfile } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'exams'>('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [dob, setDob] = useState(userProfile?.dob || '');
  const [gender, setGender] = useState(userProfile?.gender || 'Prefer not to say');
  const [country, setCountry] = useState(userProfile?.country || 'India');
  const [state, setState] = useState(userProfile?.state || 'Maharashtra');
  const [domicileState, setDomicileState] = useState(userProfile?.domicileState || 'Maharashtra');
  const [city, setCity] = useState(userProfile?.city || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');

  // Eligibility
  const [familyAnnualIncome, setFamilyAnnualIncome] = useState(
    userProfile?.familyAnnualIncome ? String(userProfile.familyAnnualIncome) : ''
  );
  const [incomeCategory, setIncomeCategory] = useState(userProfile?.incomeCategory || '2.5 - 6 Lakh');
  const [category, setCategory] = useState(userProfile?.category || 'General / Open');
  const [disabilityStatus, setDisabilityStatus] = useState(userProfile?.disabilityStatus || 'None');

  // Education
  const [currentEducationLevel, setCurrentEducationLevel] = useState(
    userProfile?.currentEducationLevel || 'Undergraduate'
  );
  const [currentDegree, setCurrentDegree] = useState(userProfile?.currentDegree || '');
  const [course, setCourse] = useState(userProfile?.course || '');
  const [branchOrStream, setBranchOrStream] = useState(userProfile?.branchOrStream || '');
  const [institutionName, setInstitutionName] = useState(userProfile?.institutionName || '');
  const [currentYearOfStudy, setCurrentYearOfStudy] = useState(userProfile?.currentYearOfStudy || 1);
  const [expectedPassingYear, setExpectedPassingYear] = useState(userProfile?.expectedPassingYear || 2028);
  const [currentPercentage, setCurrentPercentage] = useState(
    userProfile?.currentPercentage ? String(userProfile.currentPercentage) : ''
  );
  const [currentCGPA, setCurrentCGPA] = useState(
    userProfile?.currentCGPA ? String(userProfile.currentCGPA) : ''
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated: Partial<UserProfile> = {
        fullName: fullName.trim(),
        dob,
        gender,
        country,
        state,
        domicileState,
        city: city.trim(),
        phone: phone.trim(),
        familyAnnualIncome: familyAnnualIncome ? parseFloat(familyAnnualIncome) : 0,
        incomeCategory: incomeCategory as any,
        category: category as any,
        disabilityStatus: disabilityStatus as any,
        currentEducationLevel: currentEducationLevel as any,
        currentDegree: currentDegree.trim(),
        course: course.trim(),
        branchOrStream: branchOrStream.trim(),
        institutionName: institutionName.trim(),
        currentYearOfStudy: Number(currentYearOfStudy),
        expectedPassingYear: Number(expectedPassingYear),
        currentPercentage: currentPercentage ? parseFloat(currentPercentage) : undefined,
        currentCGPA: currentCGPA ? parseFloat(currentCGPA) : undefined,
        profileCompleted: true
      };

      await saveUserProfile(currentUser.uid, updated);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Student Account & Records
          </span>
          <h1 className="text-2xl font-extrabold text-white">Student Profile Settings</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your personal data, income details, academic background, and entrance exam attempts.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'profile'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            General Profile
          </button>
          <button
            onClick={() => setActiveSubTab('exams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'exams'
                ? 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Academic Exams</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeSubTab === 'exams' ? 'bg-neutral-800 text-white' : 'bg-white/10 text-neutral-300'
              }`}
            >
              {exams.length}
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'exams' ? (
        <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl">
          <ExamRecordManager
            exams={exams}
            onAddOrUpdate={onAddOrUpdateExam}
            onDelete={onDeleteExam}
          />
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile updated successfully! Match rules refreshed.</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <User className="w-4 h-4 text-neutral-400" /> Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  REGISTERED EMAIL
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full bg-[#14151e] border border-white/5 rounded-xl px-3.5 py-2 text-sm text-neutral-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  GENDER
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  STATE OF RESIDENCE
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  DOMICILE STATE (FOR STATE SCHEMES)
                </label>
                <input
                  type="text"
                  value={domicileState}
                  onChange={(e) => setDomicileState(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  CITY
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: FAMILY & ELIGIBILITY */}
          <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <Shield className="w-4 h-4 text-neutral-400" /> Income & Eligibility Factors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  ANNUAL FAMILY INCOME (INR)
                </label>
                <input
                  type="number"
                  value={familyAnnualIncome}
                  onChange={(e) => setFamilyAnnualIncome(e.target.value)}
                  placeholder="e.g. 450000"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  INCOME CATEGORY
                </label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="< 1 Lakh">&lt; 1 Lakh</option>
                  <option value="1 - 2.5 Lakh">1 - 2.5 Lakh</option>
                  <option value="2.5 - 6 Lakh">2.5 - 6 Lakh</option>
                  <option value="6 - 8 Lakh">6 - 8 Lakh</option>
                  <option value="8 - 12 Lakh">8 - 12 Lakh</option>
                  <option value="> 12 Lakh">&gt; 12 Lakh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  RESERVATION / SOCIAL CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="General / Open">General / Open</option>
                  <option value="EWS">EWS</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACADEMIC STANDING */}
          <div className="bg-[#12131b] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <GraduationCap className="w-4 h-4 text-neutral-400" /> Academic & College Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  CURRENT EDUCATION LEVEL
                </label>
                <select
                  value={currentEducationLevel}
                  onChange={(e) => setCurrentEducationLevel(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">Doctorate / Ph.D.</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  DEGREE TITLE
                </label>
                <input
                  type="text"
                  value={currentDegree}
                  onChange={(e) => setCurrentDegree(e.target.value)}
                  placeholder="B.Tech, MBBS, B.Sc"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  BRANCH / STREAM
                </label>
                <input
                  type="text"
                  value={branchOrStream}
                  onChange={(e) => setBranchOrStream(e.target.value)}
                  placeholder="e.g. Computer Science, Mechanical"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  INSTITUTION / UNIVERSITY
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="College Name"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  PERCENTAGE (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentPercentage}
                  onChange={(e) => setCurrentPercentage(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  CGPA (SCALE OF 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentCGPA}
                  onChange={(e) => setCurrentCGPA(e.target.value)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
