'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { HeartPulse, Home, PlusCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISTRICTS = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonatePage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        blood_group: '',
        district: '',
        additional_details: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const { error } = await supabase
            .from('donors')
            .insert([formData]);

        if (error) {
            setMessage({ type: 'error', text: 'Connection error. Please try again.' });
            console.error(error);
        } else {
            setMessage({ type: 'success', text: 'Donor registered successfully!' });
            setFormData({ name: '', phone: '', blood_group: '', district: '', additional_details: '' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans flex flex-col pb-20">

            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-zinc-900 p-2 rounded-lg">
                        <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Register Donor</h1>
                </div>
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 px-4 pt-6 max-w-md mx-auto w-full">

                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center gap-3 p-4 mb-6 rounded-2xl text-sm font-bold border shadow-sm ${message.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-900'
                                    : 'bg-red-50 border-red-200 text-red-900'
                                }`}
                        >
                            {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5 mb-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full h-12 rounded-xl bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full h-12 rounded-xl bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                                placeholder="+91 00000 00000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Blood Group</label>
                                <select
                                    name="blood_group"
                                    required
                                    value={formData.blood_group}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all appearance-none"
                                >
                                    <option value="" disabled>Select</option>
                                    {BLOOD_GROUPS.map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">District</label>
                                <select
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all appearance-none"
                                >
                                    <option value="" disabled>Select</option>
                                    {DISTRICTS.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Notes (Optional)</label>
                            <textarea
                                name="additional_details"
                                value={formData.additional_details}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-xl bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400 resize-none"
                                placeholder="Any specific instructions or medical context?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-red-600 text-white font-bold text-sm tracking-wide active:scale-[0.98] transition-transform disabled:opacity-70 flex items-center justify-center mt-2"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                'Submit Registration'
                            )}
                        </button>
                    </form>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 pb-safe z-50">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto px-6">
                    <Link href="/" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link href="/donate" className="flex flex-col items-center gap-1 text-red-600">
                        <PlusCircle className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Donate</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}