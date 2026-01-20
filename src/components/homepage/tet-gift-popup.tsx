'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';

const POPUP_SESSION_KEY = 'tet-popup-shown';

export default function TetGiftPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasBeenShown = sessionStorage.getItem(POPUP_SESSION_KEY);

    if (!hasBeenShown) {
      // Show the popup after a delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
      }, 2000); // 2-second delay

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 border-0 max-w-xl bg-transparent shadow-none">
        <Link href="/danh-muc/bo-qua-tang" onClick={() => setIsOpen(false)}>
            <Image
                src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1768899296/Banner_4_ds55j7.png"
                alt="Quà Tết AnSan"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
            />
        </Link>
      </DialogContent>
    </Dialog>
  );
}
