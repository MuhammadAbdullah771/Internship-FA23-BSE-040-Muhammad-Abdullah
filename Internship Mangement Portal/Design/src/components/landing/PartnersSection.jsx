import { PARTNERS } from '../../constants/landingData';

export default function PartnersSection() {
  return (
    <section className="py-12 lg:py-16 bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Collaborated with Trusted Worldwide Partners
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-14 px-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            >
              <div className="text-center">
                <span className="text-lg font-bold text-gray-400">{partner.logo}</span>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{partner.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
