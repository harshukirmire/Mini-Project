export type ExamCategory =
  | 'National Entrance'
  | 'State Entrance'
  | 'Board Examination'
  | 'Language & International'
  | 'Scholarship Specific'
  | 'University Entrance'
  | 'Other';

export interface ExamRecord {
  id: string;
  examName: string;
  examCategory: ExamCategory;
  year: number;
  session?: string;
  score?: number | string;
  percentile?: number;
  rank?: number | string;
  marks?: number | string;
  totalMarks?: number | string;
  percentage?: number;
  board?: string;
  stream?: string;
  paper?: string;
  testDate?: string;
  resultStatus?: 'Announced' | 'Awaiting Result' | 'Appearing';
  sectionScores?: Record<string, string | number>;
  additionalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  country: string;
  state: string;
  city?: string;
  phone?: string;

  // Family & Eligibility
  familyAnnualIncome?: number; // In INR or converted
  incomeCategory?: '< 1 Lakh' | '1 - 2.5 Lakh' | '2.5 - 6 Lakh' | '6 - 8 Lakh' | '8 - 12 Lakh' | '> 12 Lakh';
  category?: 'General / Open' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Other';
  disabilityStatus?: 'None' | 'Locomotor' | 'Visual' | 'Hearing' | 'Speech' | 'Multiple' | 'Other';
  disabilityPercentage?: number;
  domicileState: string;

  // Educational profile
  currentEducationLevel:
    | 'Class 10'
    | 'Class 12'
    | 'Diploma'
    | 'Undergraduate'
    | 'Postgraduate'
    | 'PhD'
    | 'Other';
  currentDegree?: string;
  course?: string;
  branchOrStream?: string;
  institutionName?: string;
  currentYearOfStudy?: number;
  expectedPassingYear?: number;
  currentPercentage?: number;
  currentCGPA?: number;
  cgpaScale?: number; // e.g. 10 or 4

  profileCompleted: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ExamRequirementType =
  | 'Scholarship-specific exam required'
  | 'University admission examination'
  | 'Language proficiency test'
  | 'Aptitude/selection test'
  | 'No separate exam required'
  | 'Depends on university/program'
  | 'Requirement not verified';

export type VerificationStatus = 'Verified' | 'Needs Review' | 'Requirement Not Verified';

export type FundingType = 'Full Funding' | 'Partial Funding' | 'Tuition Waiver' | 'Stipend / Grant' | 'Variable';

export type StudyLevel = 'Undergraduate' | 'Postgraduate' | 'Master\'s' | 'PhD' | 'Postdoctoral' | 'School (10/12)' | 'Diploma' | 'All Levels';

export interface ScholarshipDocument {
  id: string;
  name: string;
  required: boolean;
  notes?: string;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ExamRequirementDetail {
  examType: ExamRequirementType;
  examName?: string;
  purpose?: string;
  minimumScore?: string;
  examDeadline?: string;
  officialExamWebsite?: string;
  notes?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string; // e.g. Ministry of Education India, DAAD Germany, CSC China, MEXT Japan
  providerType: 'Central Government' | 'State Government' | 'International Government' | 'University' | 'Foundation / NGO' | 'Corporate';
  country: string; // "India", "Germany", "Japan", "China", "United States", "Global", etc.
  region?: string;
  university?: string; // If university-specific or "Multiple Universities"
  studyLevel: StudyLevel[];
  degreesAccepted?: string[]; // e.g. ["B.Tech", "B.Sc", "M.Sc", "Ph.D."]
  fieldOfStudy: string[]; // e.g. ["Engineering & Technology", "Natural Sciences", "All Fields"]
  
  fundingType: FundingType;
  fundingAmountDescription: string; // e.g. "Full tuition waiver + ¥147,000 monthly stipend + roundtrip airfare"
  duration?: string; // e.g. "Up to 4 years"

  deadline: string; // ISO date e.g. "2026-10-31" or "Rolling" or "Annual - Usually November"
  isDeadlineVerified: boolean;

  // Eligibility criteria for matching
  eligibility: {
    minPercentage?: number;
    minCGPA?: number;
    maxFamilyIncomeINR?: number;
    eligibleNationalities?: string[]; // ["Indian", "All International", etc.]
    eligibleStates?: string[]; // For state scholarships (e.g. ["Maharashtra"])
    categories?: string[]; // ["Open", "OBC", "SC", "ST", "Minority", "All"]
    genderEligibility?: 'All' | 'Female' | 'Transgender' | 'Male';
    disabilityOnly?: boolean;
    ageLimitMax?: number;
    educationLevels: string[];
    criteriaSummary: string;
  };

  // Exam Requirement breakdown
  examRequirement: ExamRequirementDetail;

  // Documents
  documents: ScholarshipDocument[];

  // Structured Application Procedure
  procedure: ApplicationStep[];

  // Verified Official Links
  officialWebsite: string;
  officialApplicationPortal?: string;
  officialNotificationUrl?: string;

  // Verification Audit
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
  verifiedBy?: string;
  disclaimerNotes?: string;

  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamDirectoryItem {
  id: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  countryOrRegion: string;
  conductingBody: string;
  purpose: string;
  whoTakesIt: string;
  examStructureSummary: string;
  officialWebsite: string;
  relatedPrograms: string[];
  keyDatesInfo?: string;
}

export interface SavedScholarshipRecord {
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  country: string;
  deadline: string;
  savedAt: string;
  fundingType: FundingType;
  examType: ExamRequirementType;
}

export type ApplicationTrackingStatus =
  | 'Saved'
  | 'Planning'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  country: string;
  deadline: string;
  status: ApplicationTrackingStatus;
  applicationDate?: string;
  submissionDate?: string;
  referenceNumber?: string;
  notes?: string;
  portalUrl?: string;
  reminderDays?: number[]; // e.g. [30, 14, 7, 3, 1]
  reminderStatusNote?: string; // "Data architecture stored. Push delivery pending server config"
  updatedAt: string;
  createdAt: string;
}
