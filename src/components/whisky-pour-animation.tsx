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
    const liquidInGlass = svgRef.current.querySelector('#liquid_in_glass');
    const glassClipPath = svgRef.current.querySelector('#glass_clip rect');

    if (!bottleGroup || !pourStream || !liquidInGlass || !glassClipPath) return;

    gsap.set(bottleGroup, { transformOrigin: '50% 90%' });
    gsap.set(pourStream, {
      strokeDasharray: 500,
      strokeDashoffset: 500,
    });
    gsap.set(glassClipPath, { attr: { y: 290, height: 0 } });

    const masterTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    });

    masterTimeline
      // Tilt bottle
      .to(
        bottleGroup,
        {
          duration: 2,
          rotation: -40,
          ease: 'power1.inOut',
        },
        'pour'
      )
      // Start pour stream
      .to(
        pourStream,
        {
          duration: 1,
          strokeDashoffset: 0,
          ease: 'power1.out',
        },
        'pour+=0.5'
      )
      // Fill glass
      .to(
        glassClipPath,
        {
          duration: 4.5,
          attr: { y: 200, height: 90 },
          ease: 'power2.out',
        },
        'pour+=1'
      )
      // Stop pour stream
      .to(
        pourStream,
        {
          duration: 1,
          strokeDashoffset: -500,
          ease: 'power1.in',
        },
        'pour+=4.5'
      )
      // Return bottle to upright
      .to(
        bottleGroup,
        {
          duration: 2,
          rotation: 0,
          ease: 'power2.inOut',
        },
        'pour+=5'
      )
      // Empty glass
      .to(
        glassClipPath,
        {
          duration: 1.5,
          attr: { y: 290, height: 0 },
          ease: 'power1.in',
        },
        'pour+=5.5'
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
        An animation of a dark whisky bottle tilting and pouring amber liquid into
        a Glencairn glass, which then fills up.
      </desc>
      <defs>
        <linearGradient id="whiskyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#C19A6B' }} />
          <stop offset="100%" style={{ stopColor: '#8B5A2B' }} />
        </linearGradient>
        <clipPath id="glass_clip">
          <rect x="235" y="290" width="100" height="0" />
        </clipPath>
      </defs>

      {/* Glass */}
      <g id="glass_group" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
        <path d="M250,300 C245,250 315,250 310,300" />
        <path d="M250,300 L260,320 Q280,330 300,320 L310,300" />
        <path d="M280,328 V 340 L 270,350 H 290 L 280, 340" />
        <path d="M252,192 C252,192 312,192 312,210 C312,228 252,228 252,210 C252,192 252,192 252,192 Z" fill="rgba(255,255,255,0.1)" stroke="none" />
      </g>
      
      {/* Liquid in Glass */}
      <g clipPath="url(#glass_clip)">
        <path 
            id="liquid_in_glass"
            d="M250,300 C245,250 315,250 310,300 L300,320 Q280,330 260,320 Z"
            fill="url(#whiskyGradient)"
        />
      </g>

      {/* Bottle */}
      <g id="bottle_group">
        <path
          d="M 100,150 L 100,330 C 100,340 110,350 120,350 H 180 C 190,350 200,340 200,330 L 200,150"
          fill="#1a0e04"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <path
          d="M 120,150 L 130,120 H 170 L 180,150 Z"
          fill="#1a0e04"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <rect
          x="135"
          y="100"
          width="30"
          height="20"
          fill="#2d1a0a"
        />
        <path d="M105,160 Q 110,250 105,340" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none"/>
      </g>

      {/* Pour Stream */}
      <path
        id="pour_stream"
        d="M135,110 C 155,160 230,170 280,215"
        fill="none"
        stroke="url(#whiskyGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
