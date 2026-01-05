'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function WhiskyPourAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !svgRef.current) return;
    isInitialized.current = true;

    const bottleGroup = svgRef.current.querySelector('#bottle_group');
    const pourStream = svgRef.current.querySelector('#pour_stream');
    const liquidInGlass = svgRef.current.querySelector('#liquid_in_glass_path');
    const liquidClipPath = svgRef.current.querySelector('#liquid_clip_rect');

    if (!bottleGroup || !pourStream || !liquidInGlass || !liquidClipPath) return;

    gsap.set(bottleGroup, { transformOrigin: 'bottom center', x: -20, y: -20});
    gsap.set(pourStream, {
      strokeDasharray: 500,
      strokeDashoffset: 500,
      opacity: 0
    });
    gsap.set(liquidClipPath, { attr: { y: 298, height: 0 } });
    gsap.set(liquidInGlass, { opacity: 0 });

    const masterTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    });

    masterTimeline
      .to(
        bottleGroup,
        {
          duration: 2,
          rotation: -60,
          ease: 'power1.inOut',
        },
        'pour'
      )
      .to(
        pourStream,
        {
          duration: 0.1,
          opacity: 1
        },
        'pour+=0.5'
      )
      .to(
        pourStream,
        {
          duration: 1,
          strokeDashoffset: 0,
          ease: 'power1.out',
        },
        'pour+=0.5'
      )
      .to(
        liquidInGlass,
        {
          duration: 0.1,
          opacity: 1
        },
        'pour+=1'
      )
      .to(
        liquidClipPath,
        {
          duration: 4.5,
          attr: { y: 260, height: 40 },
          ease: 'power1.out',
        },
        'pour+=1'
      )
      .to(
        pourStream,
        {
          duration: 1,
          strokeDashoffset: -500,
          ease: 'power1.in',
        },
        'pour+=4.5'
      )
       .to(
        pourStream,
        {
          duration: 0.1,
          opacity: 0
        },
        'pour+=5.5'
      )
      .to(
        bottleGroup,
        {
          duration: 2,
          rotation: 0,
          ease: 'power2.inOut',
        },
        'pour+=5'
      )
       .to(
        liquidClipPath,
        {
          duration: 1.5,
          attr: { y: 298, height: 0 },
          ease: 'power1.in',
        },
        'pour+=5.5'
      )
      .to(
        liquidInGlass,
        {
          duration: 0.1,
          opacity: 0,
        },
        'pour+=7'
      );

  }, []);

  return (
    <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-full max-w-sm h-auto"
        aria-labelledby="animationTitle animationDesc"
        role="img"
    >
      <title id="animationTitle">Whisky Pouring Animation</title>
      <desc id="animationDesc">
        A hand-drawn style animation of a whisky bottle tilting and pouring brown liquid into
        a Glencairn glass, which then fills up.
      </desc>
      <defs>
        <clipPath id="liquid_clip">
            <rect id="liquid_clip_rect" x="220" y="298" width="80" height="0" />
        </clipPath>
      </defs>

      <style>
        {`
            .whisky-color { fill: #8B5A2B; }
            .stroke-color { stroke: #000; }
            .label-text { font-family: 'DangTau', serif; font-size: 20px; text-anchor: middle; }
        `}
      </style>
      
      {/* Glass */}
      <g id="glass_group" className="stroke-color" strokeWidth="2" fill="none">
        <path d="M 233.6,298.5 C 230,280 290,280 286.4,298.5" />
        <path d="M 233.6,298.5 L 240,310 C 240,310 255,325 270,320 L 286.4,298.5" />
        <path d="M 241,310 C 250,305 240,320 260,323" />
        <path d="M 260,323 C 260,323 250,335 255,340 L 245,350 H 275 L 265,340 C 270,335 260,323 260,323" />
        <path d="M 247,348 L 273,348" />
        <path d="M 249,345 L 271,345" />
      </g>
      
      {/* Liquid in Glass */}
      <g clipPath="url(#liquid_clip)">
        <path 
            id="liquid_in_glass_path"
            className="whisky-color"
            d="M 235,298 C 232,285 288,285 285,298 L 270,320 C 270,320 250,320 250,320 L 235,298 Z"
        />
      </g>
      
      {/* Bottle */}
      <g id="bottle_group">
        <g className="stroke-color" strokeWidth="2" fill="none">
            {/* Bottle liquid */}
            <path className="whisky-color" d="M 83,293 C 90,230 140,225 152,190 L 158,168 L 118,172 L 105,195 C 90,220 80,240 83,293 Z" />
            
            {/* Bottle outline */}
            <path d="M 158,168 C 160,150 162,130 158,118 L 140,105 L 125,108 L 112,125 C 108,135 110,155 118,172" />
            <path d="M 83,293 C 80,310 90,320 105,320 L 175,315 C 190,315 200,305 197,290 C 190,230 145,220 152,190 L 158,168" />
            <path d="M 118,172 L 105,195 C 90,220 80,240 83,293" />
            <path d="M 108,318 L 172,313" />

            {/* Bottle neck shading */}
            <path d="M 116,128 L 122,168" />
            <path d="M 120,127 L 126,168" />
            <path d="M 124,126 L 130,168" />
            
            {/* Label */}
            <path d="M 100,220 C 95,250 95,270 100,290 L 180,285 C 185,265 185,245 180,225 L 100,220 Z" />
            <path d="M 105,225 C 102,250 102,265 105,285" />
            <path d="M 175,228 C 178,250 178,265 175,282" />
            <path d="M 107,283 C 120,288 160,289 173,280" />
            <path d="M 107,227 C 120,222 160,221 173,229" />
        </g>
        <text className="label-text" x="140" y="265" transform="rotate(-12, 140, 260)">WHISKY</text>
      </g>
      
      {/* Pour Stream */}
      <path
        id="pour_stream"
        d="M 112,125 C 140,150 200,180 260,265"
        fill="none"
        stroke="#8B5A2B"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}
