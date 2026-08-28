"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  initialMin: number;
  initialMax: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRangeSlider({ min, max, initialMin, initialMax, onChange }: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);
  const minValRef = useRef(initialMin);
  const maxValRef = useRef(initialMax);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = React.useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Sync state when props change (like initial page load with URL params)
  useEffect(() => {
    setMinVal(initialMin);
    setMaxVal(initialMax);
    minValRef.current = initialMin;
    maxValRef.current = initialMax;
  }, [initialMin, initialMax]);

  // Debounce the onChange callback so it doesn't spam the router while dragging
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only call if the value actually differs from the initial prop to prevent infinite loops
      if (minVal !== initialMin || maxVal !== initialMax) {
        onChange(minVal, maxVal);
      }
    }, 400); // 400ms delay after user stops sliding

    return () => clearTimeout(handler);
  }, [minVal, maxVal, initialMin, initialMax, onChange]);

  // Allow clicking on the track to jump the slider
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!range.current) return;
    const rect = range.current.parentElement!.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const value = Math.round((percent / 100) * (max - min) + min);

    // Determine which thumb is closer
    if (Math.abs(value - minVal) < Math.abs(value - maxVal)) {
      setMinVal(Math.min(value, maxVal - 1));
      minValRef.current = Math.min(value, maxVal - 1);
    } else {
      setMaxVal(Math.max(value, minVal + 1));
      maxValRef.current = Math.max(value, minVal + 1);
    }
    onChange(minValRef.current, maxValRef.current);
  };

  return (
    <div className="w-full relative py-4">
      <div 
        className="relative h-2 w-full rounded-md bg-gray-200 cursor-pointer"
        onClick={handleTrackClick}
      >
        <div
          ref={range}
          className="absolute h-2 rounded-md bg-[#006747]"
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="custom-slider absolute top-4 w-full h-2 -ml-[8px] z-20"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="custom-slider absolute top-4 w-full h-2 -ml-[8px] z-20"
      />

      <div className="flex justify-between items-center mt-6">
        <div className="flex-1 h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center px-3 bg-white">
          <span className="text-sm text-gray-500 mr-1">₹</span>
          <span className="text-sm text-gray-900 font-medium">{minVal.toLocaleString()}</span>
        </div>
        <span className="text-gray-400 mx-2">-</span>
        <div className="flex-1 h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center px-3 bg-white">
          <span className="text-sm text-gray-500 mr-1">₹</span>
          <span className="text-sm text-gray-900 font-medium">{maxVal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

