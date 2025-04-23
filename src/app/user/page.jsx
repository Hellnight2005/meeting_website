import React from 'react'
import HeroSection from '../HeroSection/page'
import ServiceSection from '../ServiceSection/page'
import WhyUs from '../Why_us/page'
import HowItWorks from '../HowItWorks/page'
import Showcase from '../Showcase/page'
import PricingCTA from '../CTA/page'
import Footer from '../Footer/page'
function User_Section() {
    return (
        <>
            <section id="home">
                <HeroSection />
            </section>

            {/* Optional, if you add ServiceSection */}
            <section id="services">
                <ServiceSection />
            </section>

            <section id="whyus">
                <WhyUs />
            </section>

            <section id="how">
                <HowItWorks />
            </section>

            <section id="showcase">
                <Showcase />
            </section>

            <section id="pricing">
                <PricingCTA />
            </section>

            <Footer />
        </>
    )
}

export default User_Section