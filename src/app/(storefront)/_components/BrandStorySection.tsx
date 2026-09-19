import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award, Compass, ShieldCheck } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa] text-zinc-900 relative overflow-hidden font-sans border-t border-gray-100">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 lg:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Story Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
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
                className="inline-flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-md group"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Pillars Box */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-6 sm:p-8 flex items-start gap-5 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-base mb-1">Uncompromised Quality</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">Handpicked equipment and accessories from the finest tour brands worldwide.</p>
                </div>
              </div>

              <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-6 sm:p-8 flex items-start gap-5 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-base mb-1">Personalised Experience</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">Tailored for players who pursue perfection and strive to improve every round.</p>
                </div>
              </div>

              <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-6 sm:p-8 flex items-start gap-5 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-base mb-1">Elegance & Performance</h4>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">Combining timeless golfing style with state-of-the-art performance technology.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
