import { motion } from 'framer-motion';
import { PARTNERS } from '../../constants/landingData';
import { fadeUp, viewportOnce } from '../../utils/landingMotion';

function PartnerLogo({ partner }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      className="flex items-center justify-center h-16 px-8 shrink-0"
    >
      <div className="text-center group cursor-default transition-transform duration-300">
        <span className="text-xl font-extrabold text-slate-300 group-hover:text-emerald-500 transition-colors duration-300">
          {partner.logo}
        </span>
        <p className="text-[10px] text-slate-400 mt-1 font-medium group-hover:text-slate-600 transition-colors hidden sm:block">
          {partner.name}
        </p>
      </div>
    </motion.div>
  );
}

export default function PartnersSection() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-14 lg:py-16 bg-white/50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center section-label"
        >
          Trusted by industry partners worldwide
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {doubled.map((partner, i) => (
            <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
