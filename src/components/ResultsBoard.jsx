import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const ResultsBoard = ({ election }) => {
  if (!election) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
        Select an election to view results.
      </div>
    );
  }

  const total = useMemo(() => election.candidates.reduce((a, c) => a + (c.votes || 0), 0), [election]);
  const maxVotes = Math.max(1, ...election.candidates.map((c) => c.votes || 0));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-semibold">Results</h2>
      </div>
      <p className="text-sm text-slate-600 mb-4">{election.title}</p>
      <div className="space-y-3">
        {election.candidates.map((c) => {
          const pct = ((c.votes || 0) / (maxVotes || 1)) * 100;
          const share = total ? Math.round(((c.votes || 0) / total) * 100) : 0;
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-xs text-slate-500">{c.votes || 0} votes • {share}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-slate-500">Total votes: {total}</div>
    </div>
  );
};

export default ResultsBoard;
