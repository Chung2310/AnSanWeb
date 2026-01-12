'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const quizQuestions = [
  {
    id: 1,
    question: 'Bạn thích hương vị nào nhất trong ly whisky của mình?',
    answers: ['Trái cây & Hoa cỏ', 'Khói & Than bùn', 'Ngọt ngào & Êm dịu', 'Đậm đà & Cay nồng'],
  },
  {
    id: 2,
    question: 'Bạn thường thưởng thức whisky vào dịp nào?',
    answers: ['Thư giãn một mình sau ngày dài', 'Cùng bạn bè thân thiết', 'Trong các bữa tiệc sang trọng', 'Trong các buổi khám phá, nếm thử'],
  },
  {
    id: 3,
    question: 'Bạn ưa thích loại rượu nào khác ngoài whisky?',
    answers: ['Vang trắng nhẹ nhàng', 'Rượu rum đậm đà', 'Cognac êm ái', 'Bia thủ công (Craft beer)'],
  },
  {
    id: 4,
    question: 'Khi chọn một món ăn, bạn ưu tiên điều gì?',
    answers: ['Sự tươi mới của hải sản', 'Vị đậm đà của thịt nướng BBQ', 'Sự ngọt ngào của món tráng miệng', 'Sự phong phú của phô mai ủ lâu năm'],
  },
  {
    id: 5,
    question: 'Phong cách sống của bạn gần với hình ảnh nào nhất?',
    answers: ['Tinh tế và tối giản', 'Mạnh mẽ và phiêu lưu', 'Cổ điển và lịch lãm', 'Sáng tạo và độc đáo'],
  },
];

type AnswersState = {
  [key: number]: string | null;
};

export default function WhiskyQuizPage() {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
    console.log('Quiz submitted:', { answers, name, email });
    toast({
      title: 'Thành công!',
      description: 'Kết quả trắc nghiệm sẽ sớm được gửi đến email của bạn.',
    });
    // Reset state if needed
    setAnswers({});
    setName('');
    setEmail('');
  };

  return (
    <div style={{ backgroundColor: '#636146' }} className="text-white min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4 py-16">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2 uppercase">
                Khám phá vị Whisky của bạn
            </h1>
            <p className="mt-4 text-lg text-white/80">Trả lời 5 câu hỏi nhanh để tìm ra loại whisky hoàn hảo dành cho bạn.</p>
        </div>

        <div className="space-y-12">
            {quizQuestions.map((quizItem, index) => (
                <div key={quizItem.id}>
                    <div className="text-left mb-6">
                        <p className="text-sm uppercase tracking-widest text-white/60">CÂU HỎI {index + 1}/{quizQuestions.length}</p>
                        <h2 className="font-headline text-2xl font-bold mt-2">
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
                            'p-6 text-left border border-white/30 hover:border-white/80 transition-all duration-300',
                            isSelected ? 'bg-white text-black font-bold' : 'bg-transparent text-white'
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

        <div className="w-full max-w-xl mx-auto p-8 md:p-12 mt-20" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="text-center">
              <h2 className="font-headline text-4xl font-black uppercase text-black">NHẬN KẾT QUẢ NGAY!</h2>
              <p className="mt-2 text-black/80">Vui lòng điền đầy đủ thông tin để nhận kết quả</p>
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
              <div className="text-center">
                 <p className="text-xs text-black/60 mb-6">
                    BẰNG VIỆC NHẤN 'NHẬN KẾT QUẢ', BẠN ĐỒNG Ý VỚI <a href="#" className="underline">ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</a> CỦA CHÚNG TÔI.
                </p>
                <Button type="submit" className="bg-black text-white font-bold uppercase tracking-widest px-8 py-6 rounded-sm hover:bg-gray-800">
                  Nhận Kết Quả
                </Button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
