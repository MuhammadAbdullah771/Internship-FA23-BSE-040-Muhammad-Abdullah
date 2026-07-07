import { motion } from 'framer-motion';
import { LANDING_STATS } from '../../constants/landingData';
import AnimatedCounter from './AnimatedCounter';
import { cardReveal, staggerContainer, viewportOnce } from '../../utils/landingMotion';

export default function StatsStrip() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-60" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {LANDING_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={cardReveal}
                custom={i}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.22 } }}
                className="text-center group rounded-3xl px-4 py-5 border border-white/10 bg-white/5 backdrop-blur-[2px]"
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-emerald-100/90 mt-2 font-medium group-hover:text-white transition-colors">
                  {stat.label}
                </p>
                <div className="w-8 h-0.5 bg-white/30 rounded-full mx-auto mt-3 group-hover:w-12 group-hover:bg-white/60 transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
