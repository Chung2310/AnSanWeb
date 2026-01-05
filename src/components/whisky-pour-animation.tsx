'use client';

import Lottie from 'lottie-react';
import animationData from '../../../public/animations/whisky-pour.json';

export default function WhiskyPourAnimation() {
  return (
    <div className="w-full max-w-sm h-auto">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
