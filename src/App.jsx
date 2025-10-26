import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import CreateElectionForm from './components/CreateElectionForm';
import ElectionList from './components/ElectionList';
import ResultsBoard from './components/ResultsBoard';

function App() {
  // Seed owner account
  const OWNER_EMAIL = 'rajankumarvarnwal1234@gmail.com';
  const OWNER_PASSWORD = 'rajan@1234';

  const [users, setUsers] = useState([
    {
      id: 'owner-1',
      role: 'owner',
      firstName: 'Owner',
      middleName: '',
      lastName: 'Account',
      mobile: '',
      email: OWNER_EMAIL,
      aadhaar: '',
      dob: '1990-01-01',
      image: '',
      rvNumber: null,
      password: OWNER_PASSWORD,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) || null, [users, currentUserId]);

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
      voters: [], // user ids who voted
    },
  ]);
  const [selectedElectionId, setSelectedElectionId] = useState('seed-1');

  // Helpers
  const isAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const selectedElection = useMemo(
    () => elections.find((e) => e.id === selectedElectionId),
    [elections, selectedElectionId]
  );

  // Registration: generate unique RV number
  const generateRV = () => {
    const rand = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const prefix = 'RV';
    return `${prefix}-${rand}`;
  };

  const handleRegister = (payload) => {
    // Ensure RV unique
    let rv = generateRV();
    while (users.some((u) => u.rvNumber === rv)) rv = generateRV();

    const id = `u_${Date.now()}`;
    const newUser = { id, role: 'user', rvNumber: rv, createdAt: new Date().toISOString(), ...payload };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(id);
    alert(`Registration successful. Your RV number is: ${rv}. Keep it safe — it is required for login.`);
  };

  // Login
  const ownerLogin = (email, password) => {
    const owner = users.find((u) => u.role === 'owner' && u.email === email && u.password === password);
    if (owner) {
      setCurrentUserId(owner.id);
    } else {
      alert('Invalid owner credentials');
    }
  };

  const userLogin = (rvNumber) => {
    const user = users.find((u) => u.rvNumber && u.rvNumber.toLowerCase() === rvNumber.trim().toLowerCase());
    if (user) {
      setCurrentUserId(user.id);
    } else {
      alert('Invalid RV number');
    }
  };

  const logout = () => setCurrentUserId(null);

  // Profile update (current user or admin/owner editing anyone)
  const updateUser = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const promoteToAdmin = (id) => {
    if (currentUser?.role !== 'owner') return;
    updateUser(id, { role: 'admin' });
  };

  const revokeAdmin = (id) => {
    if (currentUser?.role !== 'owner') return;
    updateUser(id, { role: 'user' });
  };

  // Elections
  const handleCreate = (election) => {
    if (!isAdmin) {
      alert('Only owner/admin can create elections');
      return;
    }
    setElections((prev) => [election, ...prev]);
    setSelectedElectionId(election.id);
  };

  const handleVote = (electionId, candidateId) => {
    if (!currentUser) {
      alert('Please login to vote');
      return;
    }
    setElections((prev) =>
      prev.map((el) => {
        if (el.id !== electionId) return el;
        const already = el.voters?.includes(currentUser.id);
        if (already) return el;
        const updated = {
          ...el,
          candidates: el.candidates.map((c) => (c.id === candidateId ? { ...c, votes: (c.votes || 0) + 1 } : c)),
          voters: [...(el.voters || []), currentUser.id],
        };
        return updated;
      })
    );
  };

  const hasVoted = (electionId) => {
    if (!currentUser) return false;
    const el = elections.find((e) => e.id === electionId);
    return !!el?.voters?.includes(currentUser.id);
  };

  const canVote = () => !!currentUser;

  // Local forms state
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [rvNumber, setRvNumber] = useState('');

  const [profileDraft, setProfileDraft] = useState(null);

  React.useEffect(() => {
    if (currentUser) {
      setProfileDraft({
        firstName: currentUser.firstName || '',
        middleName: currentUser.middleName || '',
        lastName: currentUser.lastName || '',
        mobile: currentUser.mobile || '',
        email: currentUser.email || '',
        aadhaar: currentUser.aadhaar || '',
        dob: currentUser.dob || '',
        image: currentUser.image || '',
      });
    } else {
      setProfileDraft(null);
    }
  }, [currentUser]);

  // Registration draft
  const [reg, setReg] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    dob: '',
    image: '',
  });

  const onImageChange = (file, setFn) => {
    if (!file) return setFn((p) => ({ ...p, image: '' }));
    const reader = new FileReader();
    reader.onload = () => setFn((p) => ({ ...p, image: reader.result }));
    reader.readAsDataURL(file);
  };

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
                Register to get your unique RV number. Only RV login is allowed for users. Owner can login with email/password and manage everything.
              </p>
            </div>
          </div>
        </section>

        {!currentUser && (
          <section className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Login Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Login</h2>
                <div className="text-xs bg-slate-100 rounded-full px-2 py-1">Owner or RV</div>
              </div>
              <div className="space-y-6">
                {/* Owner login */}
                <div>
                  <p className="text-sm font-medium mb-2">Owner Login</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Email" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Password" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <button onClick={() => ownerLogin(ownerEmail, ownerPassword)} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Login as Owner</button>
                </div>

                {/* User login */}
                <div>
                  <p className="text-sm font-medium mb-2">User Login (RV Number)</p>
                  <input value={rvNumber} onChange={(e) => setRvNumber(e.target.value)} placeholder="e.g., RV-123456" className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                  <button onClick={() => userLogin(rvNumber)} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Login with RV</button>
                </div>
              </div>
            </div>

            {/* Register Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Register</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-700">First Name</label>
                  <input value={reg.firstName} onChange={(e) => setReg({ ...reg, firstName: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="text-sm text-slate-700">Middle Name (optional)</label>
                    <input value={reg.middleName} onChange={(e) => setReg({ ...reg, middleName: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Last Name</label>
                  <input value={reg.lastName} onChange={(e) => setReg({ ...reg, lastName: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Mobile</label>
                  <input value={reg.mobile} onChange={(e) => setReg({ ...reg, mobile: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Email</label>
                  <input value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Aadhaar Number</label>
                  <input value={reg.aadhaar} onChange={(e) => setReg({ ...reg, aadhaar: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Date of Birth</label>
                  <input type="date" value={reg.dob} onChange={(e) => setReg({ ...reg, dob: e.target.value })} className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-700">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0], setReg)} className="w-full" />
                  {reg.image && (
                    <img src={reg.image} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded-lg border" />
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRegister(reg)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Register & Get RV Number
              </button>
            </div>
          </section>
        )}

        {currentUser && (
          <section className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              {isAdmin && <CreateElectionForm onCreate={handleCreate} />}
              <ElectionList
                elections={elections}
                onVote={handleVote}
                onSelect={setSelectedElectionId}
                hasVoted={hasVoted}
                canVote={canVote}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <ResultsBoard election={selectedElection} />

              {/* Profile editor */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-base font-semibold mb-3">Profile</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={profileDraft?.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (currentUser.firstName || 'U')}
                      className="h-12 w-12 rounded-full border object-cover" alt="avatar" />
                    <div>
                      <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-xs text-slate-500">Role: {currentUser.role}{currentUser.rvNumber ? ` • RV: ${currentUser.rvNumber}` : ''}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input value={profileDraft?.firstName || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, firstName: e.target.value }))} placeholder="First name" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input value={profileDraft?.lastName || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last name" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input value={profileDraft?.middleName || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, middleName: e.target.value }))} placeholder="Middle name" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 col-span-2" />
                    <input value={profileDraft?.mobile || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, mobile: e.target.value }))} placeholder="Mobile" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input value={profileDraft?.email || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input value={profileDraft?.aadhaar || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, aadhaar: e.target.value }))} placeholder="Aadhaar" className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="date" value={profileDraft?.dob || ''} onChange={(e) => setProfileDraft((p) => ({ ...p, dob: e.target.value }))} className="rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="col-span-2">
                      <label className="text-sm text-slate-700">Image</label>
                      <input type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0], (fn) => setProfileDraft((p) => ({ ...p, image: fn.image })))} className="w-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateUser(currentUser.id, profileDraft)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                    <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">Logout</button>
                  </div>
                </div>
              </div>

              {/* Owner tools */}
              {currentUser.role === 'owner' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h2 className="text-base font-semibold mb-3">User Management</h2>
                  <div className="space-y-2 max-h-72 overflow-auto pr-1">
                    {users.filter((u) => u.role !== 'owner').map((u) => (
                      <div key={u.id} className="flex items-center justify-between border rounded-lg p-2">
                        <div>
                          <p className="text-sm font-medium">{u.firstName} {u.lastName} {u.rvNumber ? `• ${u.rvNumber}` : ''}</p>
                          <p className="text-xs text-slate-500">{u.email || 'no email'} • Role: {u.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.role !== 'admin' ? (
                            <button onClick={() => promoteToAdmin(u.id)} className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white">Make Admin</button>
                          ) : (
                            <button onClick={() => revokeAdmin(u.id)} className="text-xs px-2 py-1 rounded-md bg-amber-600 text-white">Revoke</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built with ❤️ — Owner: {OWNER_EMAIL} • password: {OWNER_PASSWORD}
      </footer>
    </div>
  );
}

export default App;
