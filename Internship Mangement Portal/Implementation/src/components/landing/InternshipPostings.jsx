import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { INTERNSHIP_POSTINGS } from '../../constants/landingData';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, scaleIn, staggerContainer, viewportOnce, softHoverLift, softTap } from '../../utils/landingMotion';

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

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
    <section id="internships" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Explore Internship Opportunities</span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight tracking-tight">
            Your Dream Internship is One{' '}
            <span className="text-gradient">Click Away</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-slate-500 max-w-2xl mx-auto text-[15px]">
            Choose from 10+ in-demand tech tracks and start building real-world skills today.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="flex justify-center gap-2 mb-12"
        >
          {['all', 'trending'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 capitalize ${
                filter === f
                  ? 'text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filterPill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f === 'all' ? 'All Tracks' : 'Trending'}</span>
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((posting, i) => (
              <motion.article
                key={posting.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={i}
                whileHover={softHoverLift}
                className="group glass-card rounded-3xl overflow-hidden border border-slate-200/60 hover:shadow-premium-lg transition-shadow duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={posting.image}
                    alt={posting.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {posting.trending && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                      className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-bold uppercase rounded-full shadow-md"
                    >
                      Trending
                    </motion.span>
                  )}
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.04 }}
                    className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] font-bold rounded-full"
                  >
                    {posting.level}
                  </motion.span>
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1 group-hover:text-emerald-700 transition-colors">
                    {posting.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3 font-medium">{posting.company}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {posting.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md ring-1 ring-emerald-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{posting.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{posting.type}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{posting.spots}</span>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                    whileTap={softTap}
                    onClick={() => handleApply(posting.title)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {!isAuthenticated && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scaleIn}
            className="mt-16 text-center"
          >
            <div className="inline-block glass-card rounded-3xl px-10 py-8 border border-emerald-100/60">
              <p className="text-slate-600 font-medium mb-4">Ready to start your internship journey?</p>
              <Link
                to={ROUTES.STUDENT.LOGIN}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5"
              >
                Join Internship Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
