import React from "react";
import HeroSection from "../app/HeroSection/page";
import ServiceSection from "../app/ServiceSection/page";
import WhyUs from "../app/Why_us/page";
import HowItWorks from "../app/HowItWorks/page";
import Showcase from "../app/Showcase/page";
import CTA from "../app/CTA/page";
import Footer from "../app/Footer/page";
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

            {/* <section id="showcase">
        <Showcase />
      </section> */}

            <section id="pricing">
                <CTA />
            </section>

            <Footer />
        </>
    );
}

export default User_Section;
