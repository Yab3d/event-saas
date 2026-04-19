import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight, Activity } from 'lucide-react';
import api from '../api/axios';

const friendlyDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Could not load events. Please try again later.");
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header / Nav - Simplified for Home before user logs in */}
            <header className="absolute top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center">
                            <Activity size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">EventSaaS</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
                        <Link to="/register" className="text-sm font-medium bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">Sign Up</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
                        Discover Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Unforgettable Experience</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        From tech conferences to local music festivals, find and book the events you love with secure ticketing.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors z-20">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-2xl transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Event Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                    <span className="text-sm font-medium text-slate-400">{filteredEvents.length} results</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-400">
                        {error}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
                        <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">No events found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search terms or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Link key={event._id} to={`/events/${event._id}`} className="group relative bg-[#0b1224] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 block flex flex-col h-full">
                                {/* Image Placeholder */}
                                <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-slate-800"></div>
                                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 uppercase tracking-widest">
                                        {event.category || 'Event'}
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{event.title}</h3>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-slate-400">
                                                <Calendar size={14} className="mr-2 text-indigo-400" />
                                                {event.date ? friendlyDateFormatter.format(new Date(event.date)) : 'TBD'}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-400">
                                                <MapPin size={14} className="mr-2 text-indigo-400" />
                                                {event.location || 'Location TBD'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                        <span className="text-sm font-medium text-slate-300">By {event.organizer?.name || 'Organizer'}</span>
                                        <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                                            <ArrowRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Simple Footer */}
            <footer className="border-t border-white/5 py-8 mt-12 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} EventSaaS. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
