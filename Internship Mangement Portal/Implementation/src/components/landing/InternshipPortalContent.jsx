import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import InternshipLoginPanel from './InternshipLoginPanel';
import { fetchInternshipPostings, applyToInternship } from '../../services/internshipService';
import { useAuth } from '../../context/AuthContext';

export default function InternshipPortalContent() {
  const [postings, setPostings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isStudent } = useAuth();

  useEffect(() => {
    fetchInternshipPostings(filter === 'trending' ? { trending: true } : {})
      .then(setPostings)
      .catch(() => toast.error('Failed to load internships'))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApply = async (posting) => {
    if (!isAuthenticated || !isStudent) {
      toast('Please sign in to apply for internships', { icon: '🔒' });
      return;
    }
    const result = await applyToInternship(posting.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-3">
          Internship Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Find Your <span className="text-emerald-600">Dream Internship</span>
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Sign in on the left with Google or email, then apply to any track below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <InternshipLoginPanel />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2">
            {['all', 'trending'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All Tracks' : 'Trending'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {postings.map((posting, i) => (
                <motion.article
                  key={posting.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-100 transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={posting.image} alt={posting.title} className="w-full h-full object-cover" />
                    {posting.trending && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full">
                        Trending
                      </span>
                    )}
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-gray-600 text-[10px] font-semibold rounded-full">
                      {posting.level}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{posting.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{posting.company}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {posting.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{posting.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{posting.type}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{posting.spots}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApply(posting)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
