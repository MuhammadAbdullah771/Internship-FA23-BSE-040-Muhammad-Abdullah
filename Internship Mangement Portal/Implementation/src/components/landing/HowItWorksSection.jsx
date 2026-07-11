import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Award } from 'lucide-react';
import { fadeUp, viewportOnce, staggerContainer, cardReveal, softHoverLift } from '../../utils/landingMotion';

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up, complete onboarding, and get approved to access the internship portal.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    step: '02',
    title: 'Learn & Build',
    description: 'Browse tracks, apply to internships, and complete real-world tasks with mentor guidance.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Award,
    step: '03',
    title: 'Get Certified',
    description: 'Finish all assignments, earn your certificate, and showcase skills to employers.',
    color: 'from-cyan-500 to-blue-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="startup" className="landing-section relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-transparent pointer-events-none" />
      <div className="landing-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-12"
        >
          <motion.p variants={fadeUp} custom={0} className="section-label mb-2">
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Your journey in <span className="text-gradient">three simple steps</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-3 text-slate-500 text-sm sm:text-[15px] leading-relaxed">
            From sign-up to certification — a structured path designed to get you job-ready.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {STEPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={cardReveal}
                custom={i}
                whileHover={softHoverLift}
                className="relative group"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-emerald-200 via-teal-200 to-transparent z-0" />
                )}
                <div className="glass-card rounded-2xl p-6 h-full border border-slate-200/50 hover:shadow-premium-lg transition-shadow duration-300 relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md shadow-emerald-500/15 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-3xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
