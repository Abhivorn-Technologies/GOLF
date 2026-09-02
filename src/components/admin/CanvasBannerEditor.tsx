"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer, Rect } from 'react-konva';
import useImage from 'use-image';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontFamily: string;
}

interface CanvasBannerEditorProps {
  imageUrl: string | null;
  overlayOpacity: number;
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
}

export default function CanvasBannerEditor({ 
  imageUrl, 
  overlayOpacity, 
  title, 
  subtitle,
  titleColor,
  subtitleColor
}: CanvasBannerEditorProps) {
  const [bgImage] = useImage(imageUrl || '', 'anonymous');
  
  // Create state for our text nodes so they can be dragged
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Initialize text elements when props change, but only if they don't exist yet
  // In a real app we'd manage this state up in the form, but this is a simple demo
  useEffect(() => {
    setTexts([
      {
        id: 'title',
        text: title || 'Banner Title',
        x: 100,
        y: 100,
        fontSize: 48,
        fill: titleColor,
        fontFamily: 'Arial',
      },
      {
        id: 'subtitle',
        text: subtitle || 'Banner Subtitle',
        x: 100,
        y: 160,
        fontSize: 24,
        fill: subtitleColor,
        fontFamily: 'Arial',
      }
    ]);
  }, [title, subtitle, titleColor, subtitleColor]);

  // Handle Transformer selection
  useEffect(() => {
    if (selectedId && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'bgRect';
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    setTexts(
      texts.map((text) => {
        return text.id === id
          ? {
              ...text,
              x: e.target.x(),
              y: e.target.y(),
            }
          : text;
      })
    );
  };

  const handleTransformEnd = (e: any, id: string) => {
    const node = stageRef.current.findOne(`#${id}`);
    const scaleX = node.scaleX();
    
    node.scaleX(1);
    node.scaleY(1);
    
    setTexts(
      texts.map((text) => {
        return text.id === id
          ? {
              ...text,
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(12, text.fontSize * scaleX),
            }
          : text;
      })
    );
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
      <Stage 
        width={800} 
        height={400} 
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        ref={stageRef}
      >
        <Layer>
          {bgImage && (
            <KonvaImage 
              image={bgImage} 
              width={800} 
              height={400} 
            />
          )}
          
          <Rect
            name="bgRect"
            x={0}
            y={0}
            width={800}
            height={400}
            fill="black"
            opacity={overlayOpacity / 100}
          />

          {texts.map((text, i) => (
            <Text
              key={text.id}
              id={text.id}
              text={text.text}
              x={text.x}
              y={text.y}
              fontSize={text.fontSize}
              fill={text.fill}
              fontFamily={text.fontFamily}
              draggable
              onClick={() => selectShape(text.id)}
              onTap={() => selectShape(text.id)}
              onDragEnd={(e) => handleDragEnd(e, text.id)}
              onTransformEnd={(e) => handleTransformEnd(e, text.id)}
            />
          ))}

          {selectedId && (
            <Transformer
              ref={trRef}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
