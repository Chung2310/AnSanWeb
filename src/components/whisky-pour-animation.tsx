'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WhiskyPourAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const bottle = svgRef.current.querySelector('#bottle-group');
    const stream = svgRef.current.querySelector('#stream');
    const liquid = svgRef.current.querySelector('#liquid');
    const liquidClip = svgRef.current.querySelector('#liquid-clip-rect');
    
    if (!stream) return;
    const streamLength = (stream as SVGPathElement).getTotalLength();

    if (!bottle || !liquid || !liquidClip) return;

    gsap.set(stream, { strokeDasharray: streamLength, strokeDashoffset: streamLength });
    gsap.set(liquidClip, { attr: { y: 200 } });

    const masterTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    masterTimeline
      // Tilt the bottle
      .to(bottle, {
        duration: 1.5,
        rotation: -50,
        transformOrigin: '50% 95%',
        ease: 'power1.inOut',
      })
      // Start pouring
      .to(stream, {
        duration: 2.5,
        strokeDashoffset: 0,
        ease: 'power1.out',
      }, '-=0.5')
       // Fill the glass
      .to(liquidClip, {
        duration: 2.5,
        attr: { y: 120 },
        ease: 'power1.in',
      }, '<')
      // Stop pouring
      .to(stream, {
        duration: 0.5,
        strokeDashoffset: -streamLength,
        ease: 'power1.in',
      }, '+=0.5')
      // Reset bottle
      .to(bottle, {
        duration: 1,
        rotation: 0,
        transformOrigin: '50% 95%',
        ease: 'power2.inOut',
      }, '+=0.5')
      // Empty the glass
      .to(liquidClip, {
        duration: 0.8,
        attr: { y: 200 },
        ease: 'power1.out',
      }, '<');

  }, []);

  return (
    <div className="w-full max-w-sm h-auto">
      <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="liquid-clip">
            <rect id="liquid-clip-rect" x="225" y="200" width="150" height="80" />
          </clipPath>
        </defs>

        {/* Glass */}
        <g id="glass" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5">
          <path d="M 240 300 C 240 250, 360 250, 360 300" />
          <path d="M 240 300 L 250 200" />
          <path d="M 360 300 L 350 200" />
          <path d="M 250 200 C 250 190, 350 190, 350 200" />
        </g>
        
        {/* Liquid in Glass */}
        <g clipPath="url(#liquid-clip)">
            <path id="liquid" d="M 240 300 C 240 250, 360 250, 360 300 L 350 200 C 350 190, 250 190, 250 200 Z" fill="#b97c48" />
        </g>

        {/* Bottle */}
        <g id="bottle-group" transformOrigin="center">
          <path
            id="bottle"
            d="M 100 300 L 100 120 C 100 100, 140 100, 140 120 L 140 300 Z M 110 120 L 110 90 L 130 90 L 130 120 M 115 90 L 115 80 L 125 80 L 125 90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
          />
        </g>

        {/* Stream */}
        <path
          id="stream"
          d="M 120 80 Q 180 130, 295 195"
          fill="none"
          stroke="#b97c48"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
