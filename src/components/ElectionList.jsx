import React from 'react';
import { Clock, CheckCircle2, Vote, ChevronRight, Lock } from 'lucide-react';

function statusOf(election) {
  const now = Date.now();
  const start = new Date(election.startAt).getTime();
  const end = new Date(election.endAt).getTime();
  if (now < start) return { label: 'Upcoming', color: 'bg-amber-100 text-amber-700' };
  if (now > end) return { label: 'Ended', color: 'bg-slate-100 text-slate-700' };
  return { label: 'Active', color: 'bg-emerald-100 text-emerald-700' };
}

const ElectionList = ({ elections, onVote, onSelect, canVote, hasVoted }) => {
  if (!elections.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        No elections yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {elections.map((el) => {
        const st = statusOf(el);
        const totalVotes = el.candidates.reduce((a, c) => a + (c.votes || 0), 0);
        const voted = hasVoted ? hasVoted(el.id) : false;
        const allowed = canVote ? canVote(el.id) : true;
        return (
          <div key={el.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                    {st.label}
                  </span>
                  <button
                    onClick={() => onSelect?.(el.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    View results <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="text-base font-semibold mt-1">{el.title}</h3>
                {el.description && <p className="text-sm text-slate-600 mt-1">{el.description}</p>}
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5"/>Start: {new Date(el.startAt).toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>End: {new Date(el.endAt).toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1">Total votes: {totalVotes}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {el.candidates.map((c) => {
                const disabled = st.label !== 'Active' || voted || !allowed;
                const titleMsg = st.label !== 'Active' ? 'Voting disabled' : voted ? 'You already voted in this election' : !allowed ? 'Login to vote' : 'Vote';
                return (
                  <div key={c.id} className="border rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">Votes: {c.votes || 0}</p>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
                      onClick={() => onVote?.(el.id, c.id)}
                      disabled={disabled}
                      title={titleMsg}
                    >
                      {(!allowed || voted) ? <Lock className="h-4 w-4" /> : <Vote className="h-4 w-4" />} Vote
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ElectionList;
