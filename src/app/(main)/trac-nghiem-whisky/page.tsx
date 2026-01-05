'use client';

import { GlassWater } from 'lucide-react';

export default function WhiskyQuizPage() {
    return (
        <div className="bg-black text-white min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-4">
            <GlassWater className="h-20 w-20 text-white/30" />
            <h1 className="font-headline text-5xl font-bold mt-8 text-white">Khám Phá Gu Whisky Của Bạn</h1>
            <p className="mt-4 text-xl max-w-2xl mx-auto text-white/70">
                Tính năng đang được phát triển.
            </p>
            <p className="mt-2 text-white/50">
                Chúng tôi đang hoàn thiện bài trắc nghiệm để mang lại cho bạn những gợi ý whisky tuyệt vời nhất. Vui lòng quay lại sau!
            </p>
        </div>
    );
}
