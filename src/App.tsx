import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import {
  Scholarship,
  ExamRecord,
  SavedScholarshipRecord,
  ApplicationRecord,
  ExamDirectoryItem
} from './types';
import {
  getAllScholarships,
  getScholarshipById,
  getAllExamDirectoryItems,
  getUserExamRecords,
  saveUserExamRecord,
  deleteUserExamRecord,
  getSavedScholarships,
  saveScholarshipForUser,
  unsaveScholarshipForUser,
  getUserApplications,
  saveUserApplication,
  deleteUserApplication,
  upsertScholarship,
  deleteScholarship
} from './lib/dbService';

import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { FindForMe } from './components/FindForMe';
import { GlobalScholarships } from './components/GlobalScholarships';
import { ExamDirectory } from './components/ExamDirectory';
import { ScholarshipDetails } from './components/ScholarshipDetails';
import { SavedScholarshipsPage } from './components/SavedScholarshipsPage';
import { ApplicationTracker } from './components/ApplicationTracker';
import { SynoraGuide } from './components/SynoraGuide';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';

function MainApp() {
  const { currentUser, userProfile, loading } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);

  // App Data State
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [examsDirectory, setExamsDirectory] = useState<ExamDirectoryItem[]>([]);
  const [userExamRecords, setUserExamRecords] = useState<ExamRecord[]>([]);
  const [savedRecords, setSavedRecords] = useState<SavedScholarshipRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Load public catalog on launch
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [sList, eList] = await Promise.all([
          getAllScholarships(),
          getAllExamDirectoryItems()
        ]);
        setScholarships(sList);
        setExamsDirectory(eList);
      } catch (err) {
        console.error('Failed to load initial catalog:', err);
      } finally {
        setDataLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Load authenticated user records
  const reloadUserData = async (uid: string) => {
    try {
      const [uExams, uSaved, uApps] = await Promise.all([
        getUserExamRecords(uid),
        getSavedScholarships(uid),
        getUserApplications(uid)
      ]);
      setUserExamRecords(uExams);
      setSavedRecords(uSaved);
      setApplications(uApps);
    } catch (err) {
      console.warn('Failed to load user subcollections:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      reloadUserData(currentUser.uid);
    } else {
      setUserExamRecords([]);
      setSavedRecords([]);
      setApplications([]);
    }
  }, [currentUser]);

  // Saved scholarships lookup set
  const savedScholarshipIds = new Set(savedRecords.map((s) => s.scholarshipId));

  // Toggle Save
  const handleToggleSave = async (scholarship: Scholarship) => {
    if (!currentUser) return;
    try {
      if (savedScholarshipIds.has(scholarship.id)) {
        await unsaveScholarshipForUser(currentUser.uid, scholarship.id);
        setSavedRecords((prev) => prev.filter((r) => r.scholarshipId !== scholarship.id));
      } else {
        await saveScholarshipForUser(currentUser.uid, scholarship);
        setSavedRecords((prev) => [
          ...prev,
          {
            scholarshipId: scholarship.id,
            scholarshipName: scholarship.name,
            provider: scholarship.provider,
            country: scholarship.country,
            deadline: scholarship.deadline,
            savedAt: new Date().toISOString(),
            fundingType: scholarship.fundingType,
            examType: scholarship.examRequirement.examType
          }
        ]);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Exam Records Handlers
  const handleAddOrUpdateExam = async (exam: Omit<ExamRecord, 'id'> & { id?: string }) => {
    if (!currentUser) return;
    await saveUserExamRecord(currentUser.uid, exam);
    await reloadUserData(currentUser.uid);
  };

  const handleDeleteExam = async (examId: string) => {
    if (!currentUser) return;
    await deleteUserExamRecord(currentUser.uid, examId);
    await reloadUserData(currentUser.uid);
  };

  // Applications Tracker Handlers
  const handleStartTracking = async (scholarship: Scholarship | string) => {
    if (!currentUser) return;
    const target =
      typeof scholarship === 'string'
        ? scholarships.find((s) => s.id === scholarship)
        : scholarship;

    if (!target) return;

    await saveUserApplication(currentUser.uid, {
      scholarshipId: target.id,
      scholarshipName: target.name,
      provider: target.provider,
      country: target.country,
      deadline: target.deadline,
      status: 'In Progress',
      applicationDate: new Date().toISOString().split('T')[0],
      reminderDays: [14, 7, 3],
      reminderStatusNote: 'Reminders scheduled to database.'
    });

    await reloadUserData(currentUser.uid);
    setCurrentTab('tracker');
  };

  const handleUpdateApplication = async (appData: Partial<ApplicationRecord> & { scholarshipId: string }) => {
    if (!currentUser) return;
    await saveUserApplication(currentUser.uid, appData);
    await reloadUserData(currentUser.uid);
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!currentUser) return;
    await deleteUserApplication(currentUser.uid, appId);
    await reloadUserData(currentUser.uid);
  };

  // Admin Catalog Handlers
  const handleUpsertScholarship = async (s: Scholarship) => {
    await upsertScholarship(s);
    const updatedList = await getAllScholarships();
    setScholarships(updatedList);
  };

  const handleDeleteScholarship = async (id: string) => {
    await deleteScholarship(id);
    const updatedList = await getAllScholarships();
    setScholarships(updatedList);
  };

  // View details
  const handleViewDetails = (id: string) => {
    setSelectedScholarshipId(id);
    setCurrentTab('scholarship-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ask AI about scholarship
  const handleAskAI = (s: Scholarship) => {
    setSelectedScholarshipId(s.id);
    setCurrentTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial Auth Loading State
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-2xl flex items-center justify-center mb-4 shadow-xl animate-pulse">
          S
        </div>
        <p className="text-sm font-semibold tracking-wider uppercase font-mono text-neutral-300">
          Loading SYNORA...
        </p>
        <span className="text-xs text-neutral-500 mt-1 font-mono">
          Verifying secure credentials & database rules
        </span>
      </div>
    );
  }

  // 2. Unauthenticated: FIRST PAGE MUST BE AUTHENTICATION PAGE
  if (!currentUser) {
    return <AuthPage onSuccess={() => setCurrentTab('dashboard')} />;
  }

  // 3. New User Profile Incomplete: Multi-step Profile Setup
  if (userProfile && !userProfile.profileCompleted) {
    return <ProfileSetup onComplete={() => setCurrentTab('dashboard')} />;
  }

  // Active viewed scholarship for details page or AI guidance context
  const activeScholarship = selectedScholarshipId
    ? scholarships.find((s) => s.id === selectedScholarshipId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#0c0d12] text-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setSelectedScholarshipId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <Dashboard
            scholarships={scholarships}
            exams={userExamRecords}
            saved={savedRecords}
            applications={applications}
            savedScholarshipIds={savedScholarshipIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'find-for-me' && (
          <FindForMe
            scholarships={scholarships}
            exams={userExamRecords}
            savedScholarshipIds={savedScholarshipIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'global-scholarships' && (
          <GlobalScholarships
            scholarships={scholarships}
            savedScholarshipIds={savedScholarshipIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentTab === 'exam-directory' && (
          <ExamDirectory
            exams={examsDirectory}
            onSelectProgram={(prog) => {
              setCurrentTab('global-scholarships');
            }}
          />
        )}

        {currentTab === 'scholarship-detail' && activeScholarship && (
          <ScholarshipDetails
            scholarship={activeScholarship}
            isSaved={savedScholarshipIds.has(activeScholarship.id)}
            onToggleSave={handleToggleSave}
            onBack={() => setCurrentTab('global-scholarships')}
            onStartTracking={() => handleStartTracking(activeScholarship)}
            onAskAIAboutScholarship={handleAskAI}
          />
        )}

        {currentTab === 'saved' && (
          <SavedScholarshipsPage
            saved={savedRecords}
            onUnsave={(id) => {
              if (currentUser) {
                unsaveScholarshipForUser(currentUser.uid, id);
                setSavedRecords((prev) => prev.filter((r) => r.scholarshipId !== id));
              }
            }}
            onViewDetails={handleViewDetails}
            onStartTracking={handleStartTracking}
            onNavigateToDirectory={() => setCurrentTab('global-scholarships')}
          />
        )}

        {currentTab === 'tracker' && (
          <ApplicationTracker
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            onViewScholarship={handleViewDetails}
          />
        )}

        {currentTab === 'guide' && (
          <SynoraGuide
            scholarships={scholarships}
            exams={userExamRecords}
            applications={applications}
            activeScholarship={activeScholarship}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            exams={userExamRecords}
            onAddOrUpdateExam={handleAddOrUpdateExam}
            onDeleteExam={handleDeleteExam}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            scholarships={scholarships}
            onUpsertScholarship={handleUpsertScholarship}
            onDeleteScholarship={handleDeleteScholarship}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090a0f] py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">SYNORA</span>
            <span>—</span>
            <span>Centralized Scholarship Discovery & Exam Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Verified Official Domains Only</span>
            <span>•</span>
            <span>Zero Fabricated Cut-Offs</span>
            <span>•</span>
            <span>Grounded AI Guidance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
