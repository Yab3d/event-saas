import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Welcome, {user?.name || 'User'}
                    </h1>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <h2 className="text-xl font-semibold mb-2 text-indigo-300">Profile Details</h2>
                        <ul className="space-y-2 text-slate-300">
                            <li><span className="font-medium text-slate-400">Email:</span> {user?.email}</li>
                            <li><span className="font-medium text-slate-400">Role:</span> <span className="capitalize">{user?.role}</span></li>
                            {user?.role === 'organizer' && (
                                <li>
                                    <span className="font-medium text-slate-400">Status:</span>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user.isVerifiedOrganizer ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {user.isVerifiedOrganizer ? 'Verified' : 'Pending Verification'}
                                    </span>
                                </li>
                            )}
                            <li><span className="font-medium text-slate-400">Referral Code:</span> {user?.referralCode}</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center">
                        <p className="text-slate-400 text-center">More features coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
