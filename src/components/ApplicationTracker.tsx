import React, { useState } from 'react';
import { ApplicationRecord, ApplicationTrackingStatus } from '../types';
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Bell,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  onUpdateApplication: (app: Partial<ApplicationRecord> & { scholarshipId: string }) => Promise<void>;
  onDeleteApplication: (appId: string) => Promise<void>;
  onViewScholarship: (scholarshipId: string) => void;
}

const STATUS_OPTIONS: ApplicationTrackingStatus[] = [
  'Saved',
  'Planning',
  'In Progress',
  'Submitted',
  'Under Review',
  'Accepted',
  'Rejected',
  'Withdrawn'
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onViewScholarship
}) => {
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);

  // Modal edit states
  const [status, setStatus] = useState<ApplicationTrackingStatus>('In Progress');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderDays, setReminderDays] = useState<number[]>([14, 7, 3]);
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = (app: ApplicationRecord) => {
    setEditingApp(app);
    setStatus(app.status);
    setReferenceNumber(app.referenceNumber || '');
    setNotes(app.notes || '');
    setReminderDays(app.reminderDays || [14, 7, 3]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setIsSaving(true);

    try {
      await onUpdateApplication({
        id: editingApp.id,
        scholarshipId: editingApp.scholarshipId,
        status,
        referenceNumber: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        reminderDays,
        reminderStatusNote: 'Reminder schedules saved to profile. Notification dispatch pending push service activation.'
      });
      setEditingApp(null);
    } catch (err) {
      console.error('Failed to update application:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleReminderDay = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day].sort((a, b) => b - a));
    }
  };

  const getStatusBadge = (st: ApplicationTrackingStatus) => {
    switch (st) {
      case 'Accepted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Submitted':
      case 'Under Review':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'In Progress':
      case 'Planning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Rejected':
      case 'Withdrawn':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
          <ClipboardList className="w-4 h-4 text-neutral-300" />
          <span>Application Lifecycle & Submission Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Application Tracker</h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
          Track official application numbers, submission dates, deadlines, and personal notes.
        </p>
      </div>

      {/* Applications Table / Cards */}
      {applications.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-white/10 bg-[#12131b] text-center">
          <ClipboardList className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No applications being tracked</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            When viewing any scholarship, click "Start Tracking" to record your application progress here.
          </p>
        </div>
      ) : (
        <div className="bg-[#12131b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] border-b border-white/[0.08] text-neutral-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Scholarship</th>
                  <th className="py-3.5 px-4 font-semibold">Deadline</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Application Ref #</th>
                  <th className="py-3.5 px-4 font-semibold">Reminders</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <span
                        onClick={() => onViewScholarship(app.scholarshipId)}
                        className="font-bold text-white hover:underline cursor-pointer block text-sm"
                      >
                        {app.scholarshipName}
                      </span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        {app.provider} ({app.country})
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{app.deadline}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-semibold inline-block ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {app.referenceNumber ? (
                        <span className="text-white font-semibold">{app.referenceNumber}</span>
                      ) : (
                        <span className="text-neutral-500 italic">Not added</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {app.reminderDays && app.reminderDays.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {app.reminderDays.map((d) => (
                            <span
                              key={d}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
                            >
                              T-{d}d
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">No alerts</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(app)}
                          className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove from tracker"
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
      )}

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#12131b] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Update Application Record</h3>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">{editingApp.scholarshipName}</p>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  APPLICATION STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  OFFICIAL REFERENCE / APPLICATION NUMBER
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. NSP-2026-891024 or MEXT-APP-2026-041"
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  PERSONAL NOTES / SUBMITTED DOCUMENTS
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Uploaded Bonafide and Income Certificate. Awaiting Dean verification."
                  className="w-full bg-[#181924] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Deadline reminder intervals */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase">
                    DEADLINE REMINDER CONFIGURATION
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">Architecture Configured</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[30, 14, 7, 3, 1].map((day) => {
                    const isSelected = reminderDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleReminderDay(day)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                          isSelected
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {day} Days Before
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Reminders are stored in your user profile database. Real-time push/email notification delivery is marked as pending external server SMTP/FCM activation.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold shadow disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
