import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, saveUserProfile } from '../lib/dbService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Special configured admin email check as per spec
const ADMIN_EMAILS = ['minalakre40@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const profile = await getUserProfile(uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Construct initial baseline
        const initial: UserProfile = {
          uid,
          email,
          fullName: '',
          country: 'India',
          state: '',
          domicileState: '',
          currentEducationLevel: 'Undergraduate',
          profileCompleted: false,
          isAdmin: ADMIN_EMAILS.includes(email.toLowerCase())
        };
        setUserProfile(initial);
      }
    } catch (err) {
      console.warn('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user.uid, user.email || '');
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfile(currentUser.uid, currentUser.email || '');
    }
  };

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const initialProfile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      fullName: '',
      country: 'India',
      state: '',
      domicileState: '',
      currentEducationLevel: 'Undergraduate',
      profileCompleted: false,
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase())
    };
    await saveUserProfile(cred.user.uid, initialProfile);
    setUserProfile(initialProfile);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existing = await getUserProfile(cred.user.uid);
    if (!existing) {
      const initialProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        fullName: cred.user.displayName || '',
        country: 'India',
        state: '',
        domicileState: '',
        currentEducationLevel: 'Undergraduate',
        profileCompleted: false,
        isAdmin: ADMIN_EMAILS.includes((cred.user.email || '').toLowerCase())
      };
      await saveUserProfile(cred.user.uid, initialProfile);
      setUserProfile(initialProfile);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const isAdmin = Boolean(
    currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) ||
    userProfile?.isAdmin
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        signIn,
        signUp,
        signInWithGoogle,
        logOut,
        resetPassword,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
