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
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18 } },
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
    <section id="internships" className="landing-section relative scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/25 to-transparent pointer-events-none" />
      <div className="landing-container relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-2xl mx-auto mb-8 lg:mb-10"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-700">
              Explore Internship Opportunities
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-slate-900 leading-tight tracking-tight"
          >
            Your Dream Internship is One{' '}
            <span className="text-gradient">Click Away</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-3 text-slate-500 text-sm sm:text-[15px] leading-relaxed">
            Choose from 10+ in-demand tech tracks and start building real-world skills today.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="flex justify-center gap-2 mb-8"
        >
          {['all', 'trending'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize ${
                filter === f
                  ? 'text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white/90 text-slate-600 hover:bg-white border border-slate-200/70'
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
                className="group glass-card rounded-2xl overflow-hidden border border-slate-200/50 hover:shadow-premium-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-40 overflow-hidden shrink-0">
                  <img
                    src={posting.image}
                    alt={posting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {posting.trending && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-bold uppercase rounded-full shadow-sm">
                      Trending
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-sm text-slate-600 text-[10px] font-bold rounded-full">
                    {posting.level}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                    {posting.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{posting.company}</p>
                  <div className="flex flex-wrap gap-1 mt-2.5 mb-3">
                    {posting.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-3 mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {posting.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {posting.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {posting.spots}
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    whileTap={softTap}
                    onClick={() => handleApply(posting.title)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-emerald-500/15"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
            className="mt-10 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass-card rounded-2xl px-6 py-5 border border-emerald-100/60">
              <p className="text-slate-600 text-sm font-medium">
                Ready to start your internship journey?
              </p>
              <Link
                to={ROUTES.STUDENT.LOGIN}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20"
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
