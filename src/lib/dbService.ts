import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Scholarship,
  ExamDirectoryItem,
  UserProfile,
  ExamRecord,
  SavedScholarshipRecord,
  ApplicationRecord
} from '../types';
import { VERIFIED_SCHOLARSHIPS, VERIFIED_EXAMS } from '../data/scholarshipsData';

// User Profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from firestore:', error);
    return null;
  }
}

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);
  const timestamp = new Date().toISOString();

  if (existing.exists()) {
    await updateDoc(ref, {
      ...profile,
      updatedAt: timestamp
    });
  } else {
    await setDoc(ref, {
      uid,
      profileCompleted: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...profile
    });
  }
}

// User Exam Results Subcollection: users/{uid}/examResults/{id}
export async function getUserExamRecords(uid: string): Promise<ExamRecord[]> {
  try {
    const colRef = collection(db, 'users', uid, 'examResults');
    const snap = await getDocs(colRef);
    const list: ExamRecord[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ExamRecord));
    return list;
  } catch (error) {
    console.warn('Error loading exam records:', error);
    return [];
  }
}

export async function saveUserExamRecord(uid: string, exam: Omit<ExamRecord, 'id'> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'users', uid, 'examResults');
  const recordId = exam.id || doc(colRef).id;
  const targetRef = doc(db, 'users', uid, 'examResults', recordId);
  const now = new Date().toISOString();

  await setDoc(targetRef, {
    ...exam,
    id: recordId,
    updatedAt: now,
    createdAt: exam.createdAt || now
  }, { merge: true });

  return recordId;
}

export async function deleteUserExamRecord(uid: string, examId: string): Promise<void> {
  const targetRef = doc(db, 'users', uid, 'examResults', examId);
  await deleteDoc(targetRef);
}

// Saved Scholarships Subcollection: users/{uid}/savedScholarships/{scholarshipId}
export async function getSavedScholarships(uid: string): Promise<SavedScholarshipRecord[]> {
  try {
    const colRef = collection(db, 'users', uid, 'savedScholarships');
    const snap = await getDocs(colRef);
    const list: SavedScholarshipRecord[] = [];
    snap.forEach((d) => list.push(d.data() as SavedScholarshipRecord));
    return list;
  } catch (error) {
    console.warn('Error fetching saved scholarships:', error);
    return [];
  }
}

export async function saveScholarshipForUser(uid: string, scholarship: Scholarship): Promise<void> {
  const targetRef = doc(db, 'users', uid, 'savedScholarships', scholarship.id);
  const record: SavedScholarshipRecord = {
    scholarshipId: scholarship.id,
    scholarshipName: scholarship.name,
    provider: scholarship.provider,
    country: scholarship.country,
    deadline: scholarship.deadline,
    savedAt: new Date().toISOString(),
    fundingType: scholarship.fundingType,
    examType: scholarship.examRequirement.examType
  };
  await setDoc(targetRef, record);
}

export async function unsaveScholarshipForUser(uid: string, scholarshipId: string): Promise<void> {
  const targetRef = doc(db, 'users', uid, 'savedScholarships', scholarshipId);
  await deleteDoc(targetRef);
}

// Applications Subcollection: users/{uid}/applications/{appId}
export async function getUserApplications(uid: string): Promise<ApplicationRecord[]> {
  try {
    const colRef = collection(db, 'users', uid, 'applications');
    const snap = await getDocs(colRef);
    const list: ApplicationRecord[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ApplicationRecord));
    return list;
  } catch (error) {
    console.warn('Error fetching applications:', error);
    return [];
  }
}

export async function saveUserApplication(uid: string, appData: Partial<ApplicationRecord> & { scholarshipId: string }): Promise<string> {
  const colRef = collection(db, 'users', uid, 'applications');
  const appId = appData.id || `app_${appData.scholarshipId}`;
  const targetRef = doc(db, 'users', uid, 'applications', appId);
  const now = new Date().toISOString();

  await setDoc(targetRef, {
    ...appData,
    id: appId,
    updatedAt: now,
    createdAt: appData.createdAt || now
  }, { merge: true });

  return appId;
}

export async function deleteUserApplication(uid: string, applicationId: string): Promise<void> {
  const targetRef = doc(db, 'users', uid, 'applications', applicationId);
  await deleteDoc(targetRef);
}

// Public Scholarships Cache / Firestore
export async function getAllScholarships(): Promise<Scholarship[]> {
  try {
    const colRef = collection(db, 'scholarships');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Scholarship[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Scholarship));
      return list;
    }
  } catch (error) {
    console.warn('Firestore scholarships fetch failed or empty, fallback to verified seed data:', error);
  }
  return VERIFIED_SCHOLARSHIPS;
}

export async function getScholarshipById(id: string): Promise<Scholarship | null> {
  try {
    const targetRef = doc(db, 'scholarships', id);
    const snap = await getDoc(targetRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Scholarship;
    }
  } catch (error) {
    console.warn('Firestore scholarship by id error, checking verified fallback:', error);
  }
  return VERIFIED_SCHOLARSHIPS.find((s) => s.id === id) || null;
}

// Admin create/update scholarship
export async function upsertScholarship(scholarship: Scholarship): Promise<void> {
  const targetRef = doc(db, 'scholarships', scholarship.id);
  await setDoc(targetRef, {
    ...scholarship,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export async function deleteScholarship(id: string): Promise<void> {
  const targetRef = doc(db, 'scholarships', id);
  await deleteDoc(targetRef);
}

// Exam Directory Items
export async function getAllExamDirectoryItems(): Promise<ExamDirectoryItem[]> {
  try {
    const colRef = collection(db, 'exams');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: ExamDirectoryItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ExamDirectoryItem));
      return list;
    }
  } catch (error) {
    console.warn('Firestore exams fetch fallback to seed:', error);
  }
  return VERIFIED_EXAMS;
}
