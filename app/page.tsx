'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Droplet, Phone, User, MapPin, Plus } from 'lucide-react';

const DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type Donor = {
  id: string;
  name: string;
  phone: string;
  blood_group: string;
  district: string;
  additional_details: string;
};

export default function HomePage() {
  const [district, setDistrict] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district || !bloodGroup) return;

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('district', district)
      .eq('blood_group', bloodGroup)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donors:', error);
      setDonors([]);
    } else {
      setDonors(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans relative isolate">
      {/* Blurred Indian Tricolor Background - Top Only */}
      <div className="absolute inset-x-0 top-0 h-[50vh] -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-[#FF9933] blur-[120px] opacity-20" />
        <div className="absolute top-[10%] left-[25%] w-[50%] h-[100%] rounded-full bg-white blur-[120px] opacity-50" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-[#138808] blur-[120px] opacity-20" />
        {/* Fade to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50/50" />
      </div>

      {/* Header/Hero Section */}
      <header className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl mb-6 shadow-sm">
          <Droplet className="w-6 h-6 text-zinc-50" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
          Kerala NGOA
        </h1>
        <p className="text-zinc-600 mb-8 text-lg font-medium">
          Find available blood donors in your district quickly during emergencies.
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center justify-center h-10 px-6 font-medium transition-colors rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Become a Donor
        </Link>
      </header>

      {/* Search Section */}
      <main className="max-w-3xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-2/5">
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">District</label>
              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                <option value="" disabled>Select District</option>
                {DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-2/5">
              <label className="block text-sm font-semibold text-zinc-900 mb-1.5">Blood Group</label>
              <select
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                <option value="" disabled>Select Group</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                {loading ? 'Searching...' : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              {donors.length} {donors.length === 1 ? 'Result Found' : 'Results Found'}
            </h2>

            {donors.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-300 p-12 rounded-xl text-center text-zinc-500 flex flex-col items-center">
                <Search className="w-8 h-8 mb-3 text-zinc-400" />
                <p>No donors found for <strong>{bloodGroup}</strong> in <strong>{district}</strong>.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {donors.map((donor) => (
                  <div key={donor.id} className="bg-white p-5 rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-zinc-300">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-400" />
                        {donor.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                        <span className="flex items-center gap-1.5 bg-zinc-100 text-zinc-900 px-2.5 py-0.5 rounded-full font-semibold text-xs border border-zinc-200">
                          <Droplet className="w-3 h-3" /> {donor.blood_group}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-zinc-400" /> {donor.district}
                        </span>
                      </div>
                      {donor.additional_details && (
                        <p className="text-sm text-zinc-500 mt-2 bg-zinc-50 p-2 rounded-md border border-zinc-100">
                          {donor.additional_details}
                        </p>
                      )}
                    </div>

                    <a
                      href={`tel:${donor.phone}`}
                      className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {donor.phone}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}