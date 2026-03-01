'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/library');
      } else {
        const data = await res.json();
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[#E8E6E1] p-8 md:p-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#F0EFEA] rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-[#8F9F8A]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-serif text-center text-[#4A4A4A] mb-2">
          Therapy Collective Hub
        </h1>
        <p className="text-center text-[#8C8C8C] mb-8 text-sm">
          A peaceful digital sanctuary for our shared resources.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#6B6B6B] mb-2">
              Collective Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              placeholder="Enter the shared secret"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8F9F8A] hover:bg-[#7A8A75] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? 'Entering...' : 'Enter Sanctuary'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
