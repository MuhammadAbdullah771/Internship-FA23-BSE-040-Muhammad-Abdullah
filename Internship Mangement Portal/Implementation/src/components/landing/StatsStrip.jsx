import { motion } from 'framer-motion';
import { LANDING_STATS } from '../../constants/landingData';
import AnimatedCounter from './AnimatedCounter';
import { cardReveal, staggerContainer, viewportOnce } from '../../utils/landingMotion';

export default function StatsStrip() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="landing-container relative py-8 lg:py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {LANDING_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={cardReveal}
                custom={i}
                className="text-center px-2"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs sm:text-sm text-emerald-50/90 mt-1.5 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
