
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

const quizQuestions = [
    {
        question: "Bạn mua Whisky để làm gì?",
        options: ["Để thưởng thức, nhâm nhi", "Nhậu với bạn bè, đồng nghiệp", "Trưng bày ở nhà, văn phòng", "Tặng biếu đối tác, khách quý"],
    },
    {
        question: "Lựa chọn độ tuổi của bạn",
        options: ["21 - 33 tuổi", "34 - 40 tuổi", "41 - 50 tuổi", "50+ tuổi"],
    },
    {
        question: "Mô tả trải nghiệm của bạn với Whisky",
        options: ["Tôi chưa uống bao giờ", "Tôi mới thử một vài loại phổ biến", "Tôi đã biết mình thích gì", "Tôi là chuyên gia"],
    },
    {
        question: "Bạn thích uống Whisky như thế nào?",
        options: ["Neat", "Uống với đá", "Cocktail", "Tất cả phương án trên"],
    },
    {
        question: "Bạn sẽ thích hương vị nào nhất dưới đây?",
        type: 'image',
        options: [
            { label: "Hoa quả", imageId: "quiz-flavor-fruit" },
            { label: "Khói", imageId: "quiz-flavor-smoke" },
            { label: "Ngũ Cốc", imageId: "quiz-flavor-grain" },
            { label: "Gỗ", imageId: "quiz-flavor-wood" },
            { label: "Da", imageId: "quiz-flavor-leather" },
            { label: "Kẹo", imageId: "quiz-flavor-candy" },
        ],
    },
    {
        question: "Bạn mong muốn chi trả bao nhiêu tiền cho một chai Whisky?",
        options: ["Dưới 3 triệu đồng", "Từ 3 đến 6 triệu đồng", "Từ 6 đến 10 triệu đồng", "Trên 10 triệu đồng"],
    },
];

const formSchema = z.object({
  name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự."),
  email: z.string().email("Địa chỉ email không hợp lệ."),
});

type QuizAnswers = { [key: number]: string };

export default function WhiskyQuizPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const { toast } = useToast();

    const totalSteps = quizQuestions.length;
    const progress = (currentStep / (totalSteps + 1)) * 100;

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    };

    const handleNext = () => {
        if (answers[currentStep] !== undefined) {
            setCurrentStep(prev => prev + 1);
        } else {
            toast({
                variant: 'destructive',
                title: 'Vui lòng chọn một đáp án',
                description: 'Bạn cần chọn một tùy chọn trước khi tiếp tục.',
            });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "" },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log({
            quizAnswers: answers,
            userInfo: values
        });
        toast({
            title: "Đã gửi kết quả!",
            description: "Cảm ơn bạn! Chúng tôi sẽ sớm gửi kết quả trắc nghiệm đến email của bạn.",
        });
        setCurrentStep(currentStep + 1); // Move to thank you screen
    }

    const direction = 1;
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };
    
    return (
        <div className="bg-secondary">
            <div className="container min-h-screen py-12 flex flex-col items-center justify-center">
                <Card className="w-full max-w-3xl overflow-hidden">
                    <CardHeader className="text-center p-8">
                        <CardTitle className="font-headline text-4xl">Trắc Nghiệm Khám Phá Gu Whisky</CardTitle>
                        <CardDescription>Tìm chai whisky hoàn hảo dành cho bạn chỉ trong vài bước.</CardDescription>
                    </CardHeader>
                    <div className="p-8 border-t">
                        <Progress value={progress} className="w-full mb-8" />
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            {currentStep <= totalSteps && (
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                >
                                    {currentStep < totalSteps && (
                                        <div>
                                            <h3 className="font-bold text-lg text-center mb-2">Câu hỏi {currentStep + 1}/{totalSteps}</h3>
                                            <p className="text-xl font-semibold text-center mb-8">{quizQuestions[currentStep].question}</p>
                                            
                                            {quizQuestions[currentStep].type === 'image' ? (
                                                <RadioGroup onValueChange={handleAnswer} value={answers[currentStep]} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {quizQuestions[currentStep].options.map((option, index) => {
                                                        const image = PlaceHolderImages.find(p => p.id === option.imageId);
                                                        return (
                                                            <Label key={index} htmlFor={`q${currentStep}-option-${index}`} className="relative cursor-pointer rounded-lg border-2 border-transparent bg-secondary data-[state=checked]:border-primary transition-all">
                                                                <RadioGroupItem value={option.label} id={`q${currentStep}-option-${index}`} className="sr-only" />
                                                                {image && <Image src={image.imageUrl} alt={option.label} width={200} height={200} className="w-full h-auto aspect-square object-cover rounded-md" data-ai-hint={image.imageHint} />}
                                                                <p className="font-headline text-center p-3 text-lg">{option.label}</p>
                                                                <AnimatePresence>
                                                                {answers[currentStep] === option.label &&
                                                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-primary/70 flex items-center justify-center rounded-md">
                                                                        <CheckCircle className="text-white w-12 h-12" />
                                                                    </motion.div>
                                                                }
                                                                </AnimatePresence>
                                                            </Label>
                                                        )
                                                    })}
                                                </RadioGroup>
                                            ) : (
                                                <RadioGroup onValueChange={handleAnswer} value={answers[currentStep]} className="space-y-3">
                                                    {quizQuestions[currentStep].options.map((option, index) => (
                                                        <Label key={index} htmlFor={`q${currentStep}-option-${index}`} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                                                            <RadioGroupItem value={option.toString()} id={`q${currentStep}-option-${index}`} className="border-muted-foreground" />
                                                            <span className="ml-3 font-medium">{option.toString()}</span>
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        </div>
                                    )}

                                    {currentStep === totalSteps && (
                                        <div className="text-center">
                                            <h3 className="font-bold text-lg mb-2">Sắp xong rồi!</h3>
                                            <p className="text-xl font-semibold mb-6">Điền thông tin để nhận kết quả ngay!</p>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm mx-auto">
                                                    <FormField control={form.control} name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Họ và tên *</FormLabel>
                                                                <FormControl><Input placeholder="Nguyễn Văn A" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField control={form.control} name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Địa chỉ Email *</FormLabel>
                                                                <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                     <Button type="submit" className="w-full">Nhận Kết Quả</Button>
                                                     <p className="text-xs text-muted-foreground pt-2">
                                                        Bằng việc nhấn 'Nhận kết quả', bạn đồng ý với Điều khoản và Điều kiện của AnSan.
                                                     </p>
                                                </form>
                                            </Form>
                                        </div>
                                    )}
                                    {currentStep > totalSteps && (
                                        <div className="text-center py-10">
                                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                            <h3 className="font-bold text-2xl">Cảm ơn bạn đã tham gia!</h3>
                                            <p className="text-muted-foreground mt-2">Kết quả trắc nghiệm và những gợi ý whisky dành riêng cho bạn sẽ được gửi đến email trong ít phút.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {currentStep <= totalSteps && (
                             <div className="flex justify-between mt-8 pt-8 border-t">
                                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>Quay Lại</Button>
                                {currentStep < totalSteps && (
                                    <Button onClick={handleNext}>Tiếp Tục</Button>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
