import React, { useState } from 'react';
import { Calendar, Users, PlusCircle } from 'lucide-react';

const CreateElectionForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidatesText, setCandidatesText] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
    setCandidatesText('');
    setStartAt('');
    setEndAt('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const candidates = candidatesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((name, idx) => ({ id: `${Date.now()}_${idx}`, name, votes: 0 }));

    const election = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      candidates,
      startAt: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
      endAt: endAt ? new Date(endAt).toISOString() : new Date(Date.now() + 24*60*60*1000).toISOString(),
    };

    onCreate?.(election);
    reset();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-semibold">Create Election</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Student Council 2025"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Short summary of the election"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Users className="h-4 w-4"/>Candidates</label>
          <input
            value={candidatesText}
            onChange={(e) => setCandidatesText(e.target.value)}
            className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Comma-separated, e.g., Alice, Bob, Carol"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Calendar className="h-4 w-4"/>Start</label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Calendar className="h-4 w-4"/>End</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Election
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateElectionForm;
