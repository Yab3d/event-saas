import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-auto min-h-screen lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden bg-slate-900 border-r border-slate-800">
                {/* Glowing Aura */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center p-12 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6 backdrop-blur-sm">
                        <Sparkles size={14} /> Welcome Back
                    </div>
                    <h1 className="text-3xl lg:text-5xl lg:leading-[1.15] font-bold text-white mb-4">
                        Management made simple for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Event Organizers</span>
                    </h1>
                    <p className="text-slate-400 text-base">
                        Log in to access your dashboard, monitor ticket sales, interact with attendees, and manage your events seamlessly.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden h-full">
                {/* Mobile background elements */}
                <div className="absolute lg:hidden top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full" />
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
                            <p className="text-slate-400 text-sm">Enter your credentials to continue</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-medium text-slate-300">Password</label>
                                    <Link to="#" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors duration-300">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 mt-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-slate-400 text-xs">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
