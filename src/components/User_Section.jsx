import React from "react";
import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";

import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
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
