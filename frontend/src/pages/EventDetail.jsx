import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Ticket, Building, User, Clock, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const friendlyDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const EventDetail = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEventData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError("Event not found or an error occurred.");
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !eventData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white px-4">
                <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                <p className="text-slate-400 mb-6">{error}</p>
                <Link to="/" className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors">Back to Events</Link>
            </div>
        );
    }

    const { event, tickets } = eventData;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Minimal Nav */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to all events
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="w-full h-64 md:h-96 rounded-3xl bg-slate-800 relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 to-slate-800"></div>
                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10 uppercase tracking-widest">
                                    {event.category || 'Gathering'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">{event.title}</h1>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                {event.description || "No description provided for this event."}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                        <Calendar size={20} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">Date & Time</p>
                                        <p className="text-sm font-medium text-slate-200">{event.date ? friendlyDateFormatter.format(new Date(event.date)) : 'To be determined'}</p>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                        <MapPin size={20} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium mb-1">Location</p>
                                        <p className="text-sm font-medium text-slate-200">{event.location || 'Location TBD'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Info */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0f1730]/95 to-[#060b18]/95 border border-white/5">
                            <h3 className="text-lg font-semibold text-white mb-4">About the Organizer</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <Building size={20} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{event.organizer?.name || 'Unknown Organizer'}</p>
                                    <p className="text-xs text-slate-500 flex items-center mt-1">
                                        <CheckCircle2 size={12} className="text-emerald-400 mr-1" /> Verified Organizer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tickets */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Ticket className="mr-2 text-indigo-400" size={24} /> Select Tickets
                            </h2>

                            <div className="space-y-4">
                                {tickets && tickets.length > 0 ? (
                                    tickets.map(tier => {
                                        const available = tier.quantityAvailable - (tier.quantitySold || 0);
                                        const isSoldOut = available <= 0;

                                        return (
                                            <div key={tier._id} className={`p-4 rounded-2xl border ${isSoldOut ? 'bg-slate-950 border-slate-800 opacity-60' : 'bg-[#0b1224] border-indigo-500/20 hover:border-indigo-500/50 cursor-pointer transition-all'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-white">{tier.name}</h4>
                                                    <span className="font-bold text-white">{currencyFormatter.format(tier.price)}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mb-3">
                                                    {isSoldOut ? 'Sold Out' : `${available} tickets remaining`}
                                                </p>
                                                <button 
                                                    disabled={isSoldOut}
                                                    className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${
                                                        isSoldOut 
                                                        ? 'bg-slate-800 text-slate-500' 
                                                        : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
                                                    }`}
                                                >
                                                    {isSoldOut ? 'Unavailable' : 'Select'}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-700 rounded-xl">
                                        No tickets available yet.
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800">
                                {/* The ultimate Checkout action - hooks into next module */}
                                <button className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all text-sm">
                                    Proceed to Checkout
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4">Secure transaction via EventSaaS</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetail;
