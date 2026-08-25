import React from 'react';

interface CategoryHeroProps {
  title: string;
  description: string;
}

export default function CategoryHero({ title, description }: CategoryHeroProps) {
  return (
    <div className="w-full bg-[#1b1c1c] text-white py-16 px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 uppercase tracking-widest">
          {title}
        </h1>
        <p className="max-w-2xl text-gray-300 text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
