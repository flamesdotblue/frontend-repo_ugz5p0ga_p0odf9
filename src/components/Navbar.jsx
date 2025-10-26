import React from 'react';
import { Rocket, ShieldCheck, Github } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Rocket className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight">VoteHub</p>
            <p className="text-xs text-slate-500">MERN online voting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure & easy voting
          </span>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Github className="h-4 w-4" />
            Star
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
