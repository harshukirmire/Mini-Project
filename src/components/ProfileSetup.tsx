import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveUserProfile } from '../lib/dbService';
import { UserProfile } from '../types';
import {
  User,
  GraduationCap,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileSetupProps {
  onComplete: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Other / Non-India'
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { currentUser, userProfile, refreshProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [dob, setDob] = useState(userProfile?.dob || '');
  const [gender, setGender] = useState(userProfile?.gender || 'Prefer not to say');
  const [nationality, setNationality] = useState(userProfile?.nationality || 'Indian');
  const [country, setCountry] = useState(userProfile?.country || 'India');
  const [state, setState] = useState(userProfile?.state || 'Maharashtra');
  const [city, setCity] = useState(userProfile?.city || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');

  // Step 2 State
  const [familyAnnualIncome, setFamilyAnnualIncome] = useState<string>(
    userProfile?.familyAnnualIncome ? String(userProfile.familyAnnualIncome) : '350000'
  );
  const [incomeCategory, setIncomeCategory] = useState<UserProfile['incomeCategory']>(
    userProfile?.incomeCategory || '2.5 - 6 Lakh'
  );
  const [category, setCategory] = useState<UserProfile['category']>(
    userProfile?.category || 'General / Open'
  );
  const [disabilityStatus, setDisabilityStatus] = useState<UserProfile['disabilityStatus']>(
    userProfile?.disabilityStatus || 'None'
  );
  const [domicileState, setDomicileState] = useState(userProfile?.domicileState || 'Maharashtra');

  // Step 3 State
  const [currentEducationLevel, setCurrentEducationLevel] = useState<UserProfile['currentEducationLevel']>(
    userProfile?.currentEducationLevel || 'Undergraduate'
  );
  const [currentDegree, setCurrentDegree] = useState(userProfile?.currentDegree || 'B.Tech / B.E.');
  const [course, setCourse] = useState(userProfile?.course || 'Computer Science & Engineering');
  const [branchOrStream, setBranchOrStream] = useState(userProfile?.branchOrStream || 'Information Technology');
  const [institutionName, setInstitutionName] = useState(userProfile?.institutionName || '');
  const [currentYearOfStudy, setCurrentYearOfStudy] = useState<number>(userProfile?.currentYearOfStudy || 1);
  const [expectedPassingYear, setExpectedPassingYear] = useState<number>(userProfile?.expectedPassingYear || 2028);
  const [currentPercentage, setCurrentPercentage] = useState<string>(
    userProfile?.currentPercentage ? String(userProfile.currentPercentage) : '85'
  );
  const [currentCGPA, setCurrentCGPA] = useState<string>(
    userProfile?.currentCGPA ? String(userProfile.currentCGPA) : '8.5'
  );

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinish = async () => {
    if (!currentUser) return;
    setError(null);
    setSaving(true);

    try {
      const updatedProfile: Partial<UserProfile> = {
        fullName: fullName.trim(),
        dob,
        gender,
        nationality,
        country,
        state,
        city,
        phone,
        familyAnnualIncome: familyAnnualIncome ? parseFloat(familyAnnualIncome) : 0,
        incomeCategory,
        category,
        disabilityStatus,
        domicileState: domicileState || state,
        currentEducationLevel,
        currentDegree,
        course,
        branchOrStream,
        institutionName,
        currentYearOfStudy: Number(currentYearOfStudy),
        expectedPassingYear: Number(expectedPassingYear),
        currentPercentage: currentPercentage ? parseFloat(currentPercentage) : undefined,
        currentCGPA: currentCGPA ? parseFloat(currentCGPA) : undefined,
        profileCompleted: true
      };

      await saveUserProfile(currentUser.uid, updatedProfile);
      await refreshProfile();
      onComplete();
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please verify your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-200 px-4 py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black font-black text-xl mb-3 shadow-md">
            S
          </div>
          <h1 className="text-2xl font-extrabold text-white">Complete Your Student Profile</h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Synora utilizes these criteria strictly for personalized scholarship discovery and eligibility matching.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <div
            className={`p-3 rounded-xl border text-center transition-all ${
              step >= 1
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.02] border-white/5 text-neutral-400'
            }`}
          >
            <span className="text-[10px] font-mono block uppercase">Step 1</span>
            <span className="text-xs font-semibold">Personal</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-center transition-all ${
              step >= 2
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.02] border-white/5 text-neutral-400'
            }`}
          >
            <span className="text-[10px] font-mono block uppercase">Step 2</span>
            <span className="text-xs font-semibold">Eligibility & Income</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-center transition-all ${
              step >= 3
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.02] border-white/5 text-neutral-400'
            }`}
          >
            <span className="text-[10px] font-mono block uppercase">Step 3</span>
            <span className="text-xs font-semibold">Academic Profile</span>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-[#12131b] border border-white/[0.1] rounded-2xl p-7 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" /> Personal Information
                </h3>
                <p className="text-xs text-neutral-400">
                  Basic identifying details used for application autofill and contact records.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    GENDER
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Female">Female (Eligible for Pragati & Women grants)</option>
                    <option value="Male">Male</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    COUNTRY OF CITIZENSHIP
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    STATE OF RESIDENCE
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (!domicileState) setDomicileState(e.target.value);
                    }}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    CITY / TOWN
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune / Mumbai / Nagpur"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    PHONE / MOBILE
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FAMILY & ELIGIBILITY INFORMATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neutral-400" /> Family & Eligibility Criteria
                </h3>
                <p className="text-xs text-neutral-400">
                  Required by government portals (NSP, MahaDBT, AICTE) for income-based tuition fee concessions and reservation quotas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    ANNUAL FAMILY INCOME (INR)
                  </label>
                  <input
                    type="number"
                    value={familyAnnualIncome}
                    onChange={(e) => setFamilyAnnualIncome(e.target.value)}
                    placeholder="e.g. 400000"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Important: Many state/central schemes require &lt;= ₹8 Lakh or &lt;= ₹4.5 Lakh.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    INCOME BRACKET
                  </label>
                  <select
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value as any)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="< 1 Lakh">&lt; 1 Lakh</option>
                    <option value="1 - 2.5 Lakh">1 - 2.5 Lakh</option>
                    <option value="2.5 - 6 Lakh">2.5 - 6 Lakh</option>
                    <option value="6 - 8 Lakh">6 - 8 Lakh (EBC limit)</option>
                    <option value="8 - 12 Lakh">8 - 12 Lakh</option>
                    <option value="> 12 Lakh">&gt; 12 Lakh</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    DOMICILE STATE (FOR STATE SCHOLARSHIPS)
                  </label>
                  <select
                    value={domicileState}
                    onChange={(e) => setDomicileState(e.target.value)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    CASTE / SOCIAL CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="General / Open">General / Open</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="Minority">Religious Minority</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                  PERSON WITH DISABILITY (PWD) STATUS
                </label>
                <select
                  value={disabilityStatus}
                  onChange={(e) => setDisabilityStatus(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                >
                  <option value="None">None</option>
                  <option value="Locomotor">Locomotor Disability (40%+)</option>
                  <option value="Visual">Visual Impairment</option>
                  <option value="Hearing">Hearing Impairment</option>
                  <option value="Multiple">Multiple Disabilities</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: EDUCATIONAL PROFILE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-neutral-400" /> Current Educational Standing
                </h3>
                <p className="text-xs text-neutral-400">
                  Course level, college name, and marks for academic cut-off verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    CURRENT EDUCATION LEVEL
                  </label>
                  <select
                    value={currentEducationLevel}
                    onChange={(e) => setCurrentEducationLevel(e.target.value as any)}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Class 10">Class 10 (Secondary)</option>
                    <option value="Class 12">Class 12 (Higher Secondary)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="Undergraduate">Undergraduate (B.Tech, MBBS, B.Sc, etc.)</option>
                    <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA, etc.)</option>
                    <option value="PhD">Doctorate / Ph.D.</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    DEGREE / PROGRAM
                  </label>
                  <input
                    type="text"
                    value={currentDegree}
                    onChange={(e) => setCurrentDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.Sc / M.Sc"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    BRANCH / STREAM / FIELD
                  </label>
                  <input
                    type="text"
                    value={branchOrStream}
                    onChange={(e) => setBranchOrStream(e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical, Life Sciences"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    INSTITUTION / UNIVERSITY NAME
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. COEP Technological University / VJTI / IIT Bombay"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    YEAR OF STUDY
                  </label>
                  <select
                    value={currentYearOfStudy}
                    onChange={(e) => setCurrentYearOfStudy(Number(e.target.value))}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    PASSING YEAR
                  </label>
                  <input
                    type="number"
                    value={expectedPassingYear}
                    onChange={(e) => setExpectedPassingYear(Number(e.target.value))}
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    PERCENTAGE (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentPercentage}
                    onChange={(e) => setCurrentPercentage(e.target.value)}
                    placeholder="85"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-neutral-300 mb-1">
                    CGPA (ON 10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentCGPA}
                    onChange={(e) => setCurrentCGPA(e.target.value)}
                    placeholder="8.50"
                    className="w-full bg-[#181924] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-300 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-2 shadow"
              >
                Continue to Step {step + 1} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-2 shadow disabled:opacity-50"
              >
                {saving ? (
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Complete Profile & Go to Dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
