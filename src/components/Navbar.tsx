import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  LayoutDashboard,
  Search,
  Globe2,
  BookmarkCheck,
  ClipboardList,
  Sparkles,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, userProfile, isAdmin, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-for-me', label: 'Find For Me', icon: Search, badge: 'Smart Match' },
    { id: 'global-scholarships', label: 'Global Scholarships', icon: Globe2 },
    { id: 'exam-directory', label: 'Exam Directory', icon: GraduationCap },
    { id: 'saved', label: 'Saved', icon: BookmarkCheck },
    { id: 'tracker', label: 'Tracker', icon: ClipboardList },
    { id: 'guide', label: 'Synora Guide', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: 'Staff' });
  }

  const handleSelect = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f1015]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl tracking-tight shadow-sm shadow-white/20 transition-transform group-hover:scale-105">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">SYNORA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/10 text-neutral-300 border border-white/10">
                  SCHOLAR
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
                Discovery & Exam Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/15 shadow-inner'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-white/15 text-neutral-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right profile / logout info */}
          <div className="hidden sm:flex items-center gap-3">
            <div
              onClick={() => handleSelect('profile')}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase">
                {userProfile?.fullName ? userProfile.fullName.charAt(0) : currentUser?.email?.charAt(0) || 'U'}
              </div>
              <div className="text-left text-[11px] leading-tight max-w-[130px] truncate">
                <span className="font-semibold text-neutral-200 block truncate">
                  {userProfile?.fullName || currentUser?.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-neutral-400 block truncate font-mono">
                  {userProfile?.domicileState ? `${userProfile.domicileState}` : 'Profile'}
                </span>
              </div>
            </div>

            <button
              onClick={() => logOut()}
              title="Sign Out"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111218] border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          <div className="px-3 py-2 mb-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-white">{userProfile?.fullName || currentUser?.email}</p>
              <p className="text-[11px] text-neutral-400 font-mono">{currentUser?.email}</p>
            </div>
            <button
              onClick={() => logOut()}
              className="text-xs text-red-400 hover:underline flex items-center gap-1 font-mono"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/15'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-white/15 text-neutral-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
