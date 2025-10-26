import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import CreateElectionForm from './components/CreateElectionForm';
import ElectionList from './components/ElectionList';
import ResultsBoard from './components/ResultsBoard';

function App() {
  const [elections, setElections] = useState(() => [
    {
      id: 'seed-1',
      title: 'Student Council 2025',
      description: 'Vote for your next student leaders.',
      startAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      candidates: [
        { id: 'c1', name: 'Alice Johnson', votes: 12 },
        { id: 'c2', name: 'Bob Martinez', votes: 8 },
        { id: 'c3', name: 'Carol Singh', votes: 5 },
      ],
    },
    {
      id: 'seed-2',
      title: 'Tech Club Lead',
      description: 'Choose the next club lead for 2025.',
      startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      candidates: [
        { id: 'c4', name: 'Dana Kim', votes: 0 },
        { id: 'c5', name: 'Evan Lee', votes: 0 },
      ],
    },
  ]);
  const [selectedElectionId, setSelectedElectionId] = useState('seed-1');

  const handleCreate = (election) => {
    setElections((prev) => [election, ...prev]);
    setSelectedElectionId(election.id);
  };

  const handleVote = (electionId, candidateId) => {
    setElections((prev) =>
      prev.map((el) =>
        el.id !== electionId
          ? el
          : {
              ...el,
              candidates: el.candidates.map((c) =>
                c.id === candidateId ? { ...c, votes: (c.votes || 0) + 1 } : c
              ),
            }
      )
    );
  };

  const selectedElection = useMemo(
    () => elections.find((e) => e.id === selectedElectionId),
    [elections, selectedElectionId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 pointer-events-none" />
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Online Voting System
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Create elections, add candidates, and collect votes in real-time. This UI is ready for a MERN backend when you are.
              </p>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CreateElectionForm onCreate={handleCreate} />
            <ElectionList
              elections={elections}
              onVote={handleVote}
              onSelect={setSelectedElectionId}
            />
          </div>

          <div className="lg:col-span-1">
            <ResultsBoard election={selectedElection} />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built with ❤️ — Ready for MongoDB, Express, React, and Node integration
      </footer>
    </div>
  );
}

export default App;
