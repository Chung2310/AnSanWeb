'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';

export default function TetGiftPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup after a delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 max-w-xl bg-transparent shadow-none border-4 border-amber-500">
        <DialogHeader className="sr-only">
          <DialogTitle>Quà Tết AnSan Promotion</DialogTitle>
          <DialogDescription>
            A promotional popup for AnSan's Tet gift sets. Click to explore the gift sets.
          </DialogDescription>
        </DialogHeader>
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
