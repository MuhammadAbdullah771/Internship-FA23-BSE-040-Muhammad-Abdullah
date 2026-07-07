import HeroSection from '../components/landing/HeroSection';
import StatsStrip from '../components/landing/StatsStrip';
import PartnersSection from '../components/landing/PartnersSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import InternshipPostings from '../components/landing/InternshipPostings';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <PartnersSection />
      <HowItWorksSection />
      <InternshipPostings />
      <LandingFooter />
    </>
  );
}
