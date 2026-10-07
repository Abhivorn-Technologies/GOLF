import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award, Compass, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function BrandStorySection() {
  const pillars = [
    {
      icon: Award,
      title: 'Uncompromised Quality',
      description: 'Handpicked equipment and accessories from the finest tour brands worldwide.'
    },
    {
      icon: Compass,
      title: 'Personalised Experience',
      description: 'Tailored for players who pursue perfection and strive to improve every round.'
    },
    {
      icon: ShieldCheck,
      title: 'Elegance & Performance',
      description: 'Combining timeless golfing style with state-of-the-art performance technology.'
    }
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa] text-zinc-900 relative overflow-hidden font-sans border-t border-gray-100">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 lg:p-16 shadow-[0_15px_45px_rgba(0,0,0,0.04)] relative overflow-hidden">
            
            {/* Subtle Ambient Accent Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Story Column with Slide Animation */}
              <div className="lg:col-span-7 flex flex-col items-start">
                
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>The Lorven Golf Story</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight tracking-tight uppercase mb-6">
                  Where Passion Meets The Game
                </h2>

                <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium mb-6">
                  Born from a passion for golf and inspired by the pursuit of excellence, Lorven Golf is built on a deep appreciation for the game and the people who play it. We believe golf is not simply about the score—it is about the experience, the discipline, the elegance, and the endless pursuit of a better game.
                </p>

                <div className="pt-2 mb-8 border-l-4 border-emerald-600 pl-4 py-1">
                  <p className="text-zinc-800 font-bold text-sm sm:text-base italic">
                    "Every detail at Lorven Golf is chosen with the golfer in mind—creating a destination where quality, performance, and style come together."
                  </p>
                </div>

                <Link 
                  href="/about"
                  className="inline-flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>

              {/* Right Pillars Box with Staggered Scroll Animations & Hover Elevate */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <ScrollReveal key={idx} animation="fade-left" delay={idx * 150} duration={600}>
                      <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-6 sm:p-7 flex items-start gap-5 hover:bg-white hover:shadow-lg hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                            {pillar.title}
                          </h4>
                          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
