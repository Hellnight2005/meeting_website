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
            <HeroSection />
            {/*  */}
            <WhyUs />
            <HowItWorks />
            <Showcase />
            <PricingCTA />
            <Footer />

        </>
    )
}

export default User_Section