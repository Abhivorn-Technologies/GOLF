"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
}

export default function Barcode({ value, height = 45, fontSize = 14, displayValue = true }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          lineColor: "#000000",
          width: 2,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          font: "monospace",
          margin: 4
        });
      } catch (err) {
        console.error("Barcode generation error:", err);
      }
    }
  }, [value, height, fontSize, displayValue]);

  return <svg ref={svgRef} className="max-w-full mx-auto" />;
}
