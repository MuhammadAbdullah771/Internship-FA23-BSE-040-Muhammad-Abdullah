import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { INTERNSHIP_POSTINGS } from '../../constants/landingData';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function InternshipPostings() {
  const [filter, setFilter] = useState('all');
  const { isAuthenticated } = useAuth();

  const filtered = filter === 'all'
    ? INTERNSHIP_POSTINGS
    : INTERNSHIP_POSTINGS.filter((p) => p.trending);

  const handleApply = (title) => {
    if (!isAuthenticated) {
      toast('Please sign in to apply for internships', { icon: '🔒' });
      return;
    }
    toast.success(`Application started for ${title}`);
  };

  return (
    <section id="internships" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
              Trending
            </span>
            <span className="text-sm text-gray-500">Explore Internship Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight">
            Your Dream Internship is Just One{' '}
            <span className="text-emerald-600">Click Away!</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Choose from 10+ in-demand tech tracks and start building real-world skills today.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {['all', 'trending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All Tracks' : 'Trending'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((posting, i) => (
            <motion.article
              key={posting.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={posting.image}
                  alt={posting.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {posting.trending && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full">
                    Trending
                  </span>
                )}
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 text-gray-600 text-[10px] font-semibold rounded-full">
                  {posting.level}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{posting.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{posting.company}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {posting.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{posting.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{posting.type}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{posting.spots} spots</span>
                </div>
                <button
                  onClick={() => handleApply(posting.title)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="mt-12 text-center space-y-3">
            <p className="text-gray-500">Ready to start your internship journey?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={ROUTES.STUDENT_SIGNUP}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={ROUTES.STUDENT_LOGIN}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign In to Apply
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
