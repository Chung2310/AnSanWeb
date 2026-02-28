'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { summarizeContactForm } from "@/ai/flows/contact-form-ai-summary";

const formSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự."),
  email: z.string().email("Email không hợp lệ."),
  message: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự.").max(500, "Nội dung không được quá 500 ký tự."),
});

export default function ContactPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Save the message to Firestore
            const contactsCol = collection(firestore, 'contacts');
            addDocumentNonBlocking(contactsCol, {
                ...values,
                createdAt: serverTimestamp(),
                status: 'new'
            });

            // Trigger AI summary in background
            summarizeContactForm(values).then(result => {
                console.log("AI Insights generated:", result.summary);
            }).catch(err => {
                console.error("AI Insights error:", err);
            });

            toast({
                title: "Gửi thành công!",
                description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
            });
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Đã có lỗi xảy ra",
                description: "Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.",
            });
        }
    }

    return (
        <div className="container py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">Liên Hệ Với Chúng Tôi</CardTitle>
                    <CardDescription className="text-lg">Chúng tôi luôn sẵn lòng lắng nghe bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nguyễn Văn A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nội dung</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nội dung bạn muốn trao đổi..."
                                                className="resize-none h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-12 text-base font-bold" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
