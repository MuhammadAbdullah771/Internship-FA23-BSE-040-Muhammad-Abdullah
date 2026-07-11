import { motion } from 'framer-motion';
import { PARTNERS } from '../../constants/landingData';
import { fadeUp, viewportOnce } from '../../utils/landingMotion';

function PartnerLogo({ partner }) {
  return (
    <div className="flex items-center justify-center h-12 px-7 shrink-0">
      <div className="text-center group cursor-default">
        <span className="text-lg font-extrabold text-slate-300 group-hover:text-emerald-500 transition-colors duration-300">
          {partner.logo}
        </span>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium group-hover:text-slate-600 transition-colors hidden sm:block">
          {partner.name}
        </p>
      </div>
    </div>
  );
}

export default function PartnersSection() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-8 lg:py-10 bg-white/60 border-y border-slate-200/50 overflow-hidden">
      <div className="landing-container mb-5">
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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {doubled.map((partner, i) => (
            <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
