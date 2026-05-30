import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageWrapper from '../components/layout/PageWrapper'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Features from '../components/landing/Features'
import SampleReport from '../components/landing/SampleReport'
import Testimonials from '../components/landing/Testimonials'
import PricingSection from '../components/landing/Pricing'
import CTA from '../components/landing/CTA'

export default function Landing() {
  return (
    <PageWrapper>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <SampleReport />
        <Testimonials />
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </PageWrapper>
  )
}
