
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
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function TetGiftPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(() => doc(firestore, 'settings', 'general'), [firestore]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (settings && settings.popup?.enabled) {
      const delay = settings.popup.delay || 2000;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [settings]);

  if (!settings || !settings.popup?.enabled) return null;

  const { imageUrl, targetUrl } = settings.popup;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 max-w-xl bg-transparent shadow-none border-4 border-amber-500 overflow-visible">
        <DialogHeader className="sr-only">
          <DialogTitle>Thông báo khuyến mãi</DialogTitle>
          <DialogDescription>
            Chương trình ưu đãi đặc biệt từ AnSan.
          </DialogDescription>
        </DialogHeader>
        
        <DialogClose className="absolute -top-4 -right-4 z-[60] bg-amber-500 text-white rounded-full p-1.5 shadow-xl hover:bg-amber-600 transition-all border-2 border-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </DialogClose>

        <Link href={targetUrl || '/'} onClick={() => setIsOpen(false)}>
            <Image
                src={imageUrl}
                alt="Popup Promotion"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
                unoptimized // Useful for external links like Cloudinary
            />
        </Link>
      </DialogContent>
    </Dialog>
  );
}
