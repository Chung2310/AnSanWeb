'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function WhiskyPourAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/animations/whisky-pour.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading animation data:', error));
  }, []);

  if (!animationData) {
    // You can return a loading spinner or a placeholder here
    return <div className="w-full max-w-sm h-auto" style={{ aspectRatio: '649 / 670' }} />;
  }

  return (
    <div className="w-full max-w-sm h-auto">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
