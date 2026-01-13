
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const quizQuestions = [
  {
    id: 1,
    question: 'Bạn thích loại rượu vang nào?',
    answers: ['Vang đỏ', 'Vang trắng', 'Vang hồng (Rosé)', 'Vang sủi/Champagne'],
  },
  {
    id: 2,
    question: 'Bạn thường uống rượu vang vào dịp nào?',
    answers: ['Trong bữa ăn hàng ngày', 'Tiệc tùng cùng bạn bè', 'Những dịp đặc biệt, sang trọng', 'Thư giãn một mình'],
  },
  {
    id: 3,
    question: 'Bạn ưu tiên yếu tố nào nhất khi chọn rượu vang?',
    answers: ['Hương vị trái cây', 'Độ đậm đà (body)', 'Đến từ vùng nổi tiếng', 'Giá cả hợp lý'],
  },
  {
    id: 4,
    question: 'Bạn muốn khám phá rượu vang từ quốc gia nào?',
    answers: ['Pháp', 'Ý', 'Tây Ban Nha / Bồ Đào Nha', 'Chile / Argentina / Úc (New World)'],
  },
];

type AnswersState = {
  [key: number]: string | null;
};

export default function WineQuizPage() {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allAnswered = quizQuestions.every(q => answers[q.id]);
    if (!name || !email) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ họ tên và email.',
      });
      return;
    }
     if (!allAnswered) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Vui lòng trả lời tất cả các câu hỏi.',
      });
      return;
    }
    console.log('Quiz submitted:', { answers, name, email, phone });
    toast({
      title: 'Thành công!',
      description: 'Cảm ơn bạn đã tham gia. Chuyên gia của chúng tôi sẽ sớm liên hệ để tư vấn loại vang phù hợp nhất với bạn.',
    });
    // Reset state if needed
    setAnswers({});
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center p-4 py-16">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 uppercase text-gray-800">
                Khám Phá Gu Rượu Vang Của Bạn
            </h1>
            <p className="mt-4 text-lg text-gray-600">Trả lời nhanh các câu hỏi sau để nhận được tư vấn chuyên sâu từ chuyên gia rượu vang của chúng tôi.</p>
        </div>

        <div className="space-y-12">
            {quizQuestions.map((quizItem, index) => (
                <div key={quizItem.id}>
                    <div className="text-left mb-6">
                        <p className="text-sm uppercase tracking-widest text-gray-500">CÂU HỎI {index + 1}/{quizQuestions.length}</p>
                        <h2 className="font-headline text-2xl font-bold mt-2 text-gray-800">
                            {quizItem.question}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizItem.answers.map((answer, answerIndex) => {
                        const isSelected = answers[quizItem.id] === answer;
                        return (
                        <button
                            key={answerIndex}
                            onClick={() => handleAnswerSelect(quizItem.id, answer)}
                            className={cn(
                            'p-6 text-left border transition-all duration-300',
                            isSelected 
                                ? 'bg-primary text-primary-foreground font-bold border-primary' 
                                : 'bg-white text-black border-gray-300 hover:border-primary'
                            )}
                        >
                            <span className="text-lg">{answer}</span>
                        </button>
                        );
                    })}
                    </div>
                </div>
            ))}
        </div>

        <div className="w-full max-w-xl mx-auto p-8 md:p-12 mt-20 bg-secondary">
            <div className="text-center">
              <h2 className="font-headline text-4xl font-black uppercase text-black">NHẬN TƯ VẤN NGAY!</h2>
              <p className="mt-2 text-black/80">Vui lòng điền đầy đủ thông tin để nhận được tư vấn từ chuyên gia.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider text-black mb-2">HỌ VÀ TÊN *</label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/80 border-0 border-b-2 border-black/40 rounded-none focus:ring-0 focus:border-black text-black placeholder-black/50"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-black mb-2">ĐỊA CHỈ EMAIL *</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                   className="bg-white/80 border-0 border-b-2 border-black/40 rounded-none focus:ring-0 focus:border-black text-black placeholder-black/50"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider text-black mb-2">SỐ ĐIỆN THOẠI</label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                   className="bg-white/80 border-0 border-b-2 border-black/40 rounded-none focus:ring-0 focus:border-black text-black placeholder-black/50"
                  placeholder=""
                />
              </div>
              <div className="text-center">
                 <p className="text-xs text-black/60 mb-6">
                    BẰNG VIỆC NHẤN 'NHẬN KẾT QUẢ', BẠN ĐỒNG Ý VỚI <a href="#" className="underline">ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</a> CỦA CHÚNG TÔI.
                </p>
                <Button type="submit" className="bg-black text-white font-bold uppercase tracking-widest px-8 py-6 rounded-sm hover:bg-gray-800">
                  Gửi Thông Tin
                </Button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
