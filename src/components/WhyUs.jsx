// components/WhyUs.tsx
"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
    {
        title: "Built with Modern Tools",
        description:
            "We use cutting-edge technologies like Next.js, Tailwind CSS, and Prisma to build scalable, fast, and maintainable web apps.",
    },
    {
        title: "SEO & Performance Optimized",
        description:
            "Our websites are optimized for fast loading, responsive design, and search engine visibility to help you grow organically.",
    },
    {
        title: "Ongoing Support",
        description:
            "We offer continuous support and updates to keep your site secure, functional, and aligned with your goals.",
    },
];

export default function WhyUs() {
    return (
        <section className="bg-white dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.2 }}
                className="max-w-5xl mx-auto text-center"
            >
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Why Choose Us?
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                        >
                            <CheckCircle className="text-green-500 w-6 h-6 mb-4" />
                            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
