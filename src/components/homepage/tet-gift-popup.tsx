
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

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
      <DialogContent className="p-0 max-w-xl bg-transparent shadow-none border-4 border-amber-500 overflow-visible">
        <DialogHeader className="sr-only">
          <DialogTitle>Quà Tết AnSan Promotion</DialogTitle>
          <DialogDescription>
            A promotional popup for AnSan's Tet gift sets. Click to explore the gift sets.
          </DialogDescription>
        </DialogHeader>
        
        {/* Nút đóng (X) riêng cho banner này */}
        <DialogClose className="absolute -top-4 -right-4 z-[60] bg-amber-500 text-white rounded-full p-1.5 shadow-xl hover:bg-amber-600 transition-all border-2 border-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </DialogClose>

        <Link href="/danh-muc/bo-qua-tang" onClick={() => setIsOpen(false)}>
            <Image
                src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1774236454/Kh%C3%A1m_ph%C3%A1_axn4xt.jpg"
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
