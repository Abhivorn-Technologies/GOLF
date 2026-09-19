import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Award, MapPin, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'The Lorven Golf Story | Where Passion Meets the Game',
  description: 'Born from a passion for golf and inspired by the pursuit of excellence. Discover Lorven Golf - where quality, performance, style, and passion come together.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-zinc-800">
      
      {/* Hero Banner Section */}
      <section className="relative bg-zinc-900 text-white py-24 sm:py-32 overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-zinc-800/90 border border-zinc-700 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Lorven Golf Story</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase max-w-4xl leading-tight mb-6">
            Where Passion Meets The Game
          </h1>
          
          <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed mb-8">
            Built on a deep appreciation for the game of golf and the dedicated players who pursue perfection in every swing.
          </p>

          <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
        </div>
      </section>

      {/* Main Story Content Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Story Text Left */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Our Heritage & Passion</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              Born from a Passion for Golf. Inspired by the Pursuit of Excellence.
            </h2>
            <div className="space-y-5 text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              <p>
                Lorven Golf is built on a deep appreciation for the game and the people who play it. We believe golf is not simply about the score—it is about the experience, the discipline, the elegance, and the endless pursuit of a better game.
              </p>
              <p>
                Our vision is to create a distinctive golf destination where quality, performance, style, and passion come together. From carefully selected equipment and accessories to a personalised experience, every detail at Lorven Golf is chosen with the golfer in mind.
              </p>
              <p className="text-zinc-900 font-bold italic border-l-4 border-emerald-500 pl-4 py-1">
                For those who appreciate the game, pursue perfection, and believe that every round is an opportunity to be better, Lorven Golf is more than a brand—it is a way of experiencing the greatest game ever played.
              </p>
            </div>
          </div>

          {/* Quote Card Right */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-4">Our Brand Promise</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Every club, accessory, and fitting at Lorven Golf is selected with uncompromised standards for craftsmanship and tour-level performance.
              </p>
              <div className="pt-6 border-t border-gray-100">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Lorven Golf</span>
                <span className="text-sm font-extrabold text-zinc-900">Where Passion Meets The Game</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-900 tracking-tight mb-3">The Four Pillars of Lorven Golf</h2>
            <p className="text-zinc-500 text-sm font-medium">The principles that define every product and customer interaction.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-5 font-bold text-lg">01</div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">The Experience</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Personalised service tailored to every golfer's unique playing style and handicap.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-5 font-bold text-lg">02</div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">The Discipline</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Respect for the heritage and tradition of golf while innovating for modern play.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-5 font-bold text-lg">03</div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">The Elegance</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Refined aesthetics, premium materials, and distinctive style on and off the course.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-5 font-bold text-lg">04</div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">The Perfection</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Continuous pursuit of better equipment, better performance, and a better game.</p>
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Visit Our Golf Destination</span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Experience Lorven Golf</h3>
            <div className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white font-bold block mb-1">LORVEN GOLF HQ</strong>
                Plot No. 8-1-43/1/B, Satya Colony, Qutub Shahi Tombs Road, Shaikpet, Golconda, Hyderabad, Telangana - 500008
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 px-8 py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
