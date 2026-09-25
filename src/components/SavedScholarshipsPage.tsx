import React from 'react';
import { SavedScholarshipRecord } from '../types';
import {
  BookmarkCheck,
  Calendar,
  ExternalLink,
  Trash2,
  ClipboardList,
  ArrowRight,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface SavedScholarshipsPageProps {
  saved: SavedScholarshipRecord[];
  onUnsave: (scholarshipId: string) => void;
  onViewDetails: (scholarshipId: string) => void;
  onStartTracking: (scholarshipId: string) => void;
  onNavigateToDirectory: () => void;
}

export const SavedScholarshipsPage: React.FC<SavedScholarshipsPageProps> = ({
  saved,
  onUnsave,
  onViewDetails,
  onStartTracking,
  onNavigateToDirectory
}) => {
  const getDaysLeft = (deadline: string) => {
    if (deadline === 'Rolling') return 'Rolling';
    const target = new Date(deadline).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Due Today';
    return `${diffDays} days left`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Bookmarked Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Scholarships</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Keep track of shortlisted grants, upcoming cut-offs, and quickly transition opportunities to the application tracker.
          </p>
        </div>

        <button
          onClick={onNavigateToDirectory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow transition-all shrink-0"
        >
          Explore More Scholarships <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List or Empty State */}
      {saved.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-white/10 bg-[#12131b] text-center">
          <BookmarkCheck className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No saved scholarships yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Click the bookmark icon on any scholarship in the Global Directory or Find For Me to save it here.
          </p>
          <button
            onClick={onNavigateToDirectory}
            className="mt-4 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 shadow"
          >
            Browse Global Scholarships
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => {
            const timeLeft = getDaysLeft(item.deadline);
            const isUrgent = timeLeft.includes('days') && parseInt(timeLeft) <= 14;

            return (
              <div
                key={item.scholarshipId}
                className="bg-[#12131b] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                      {item.country} • {item.fundingType}
                    </span>
                    <button
                      onClick={() => onUnsave(item.scholarshipId)}
                      title="Remove from saved"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onViewDetails(item.scholarshipId)}
                    className="text-base font-bold text-white mt-2 hover:underline cursor-pointer line-clamp-2"
                  >
                    {item.scholarshipName}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{item.provider}</p>

                  {/* Deadline & countdown */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.deadline}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        isUrgent
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : timeLeft === 'Expired'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {timeLeft}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(item.scholarshipId)}
                    className="flex-1 py-2 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onStartTracking(item.scholarshipId)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5" /> Track
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
