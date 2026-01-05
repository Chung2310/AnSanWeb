import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function FounderPage() {
    const founderImage = PlaceHolderImages.find(p => p.id === 'avatar-1');

    return (
        <>
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container text-center">
                    <h1 className="font-headline text-5xl font-bold">Về Nhà Sáng Lập</h1>
                    <p className="mt-4 text-xl max-w-3xl mx-auto text-primary-foreground/80">
                        Người đứng sau niềm đam mê và tầm nhìn của AnSan.
                    </p>
                </div>
            </div>
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="md:col-span-1">
                            {founderImage && (
                                <Image 
                                    src={founderImage.imageUrl}
                                    alt="Nhà sáng lập AnSan"
                                    width={500}
                                    height={500}
                                    className="rounded-full w-full aspect-square object-cover shadow-2xl"
                                    data-ai-hint={founderImage.imageHint}
                                />
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="font-headline text-4xl font-bold text-foreground">Trần Tuấn Anh</h2>
                            <p className="text-primary font-semibold mt-1">Nhà Sáng Lập & Chuyên Gia Rượu</p>
                            <div className="prose prose-lg dark:prose-invert mt-6 max-w-none">
                                <p>Với hơn một thập kỷ đắm chìm trong thế giới rượu mạnh, anh Trần Tuấn Anh không chỉ là một nhà kinh doanh mà còn là một người kể chuyện, một người truyền cảm hứng. Hành trình của anh bắt đầu từ một niềm đam mê cá nhân, dần trở thành một sứ mệnh - mang những giá trị đích thực của whisky và rượu vang đến với cộng đồng người yêu rượu tại Việt Nam.</p>
                                <p>Anh tin rằng mỗi chai rượu đều chứa đựng một câu chuyện về lịch sử, văn hóa và nghệ thuật. Chính vì vậy, AnSan được thành lập không chỉ để bán rượu, mà còn để chia sẻ kiến thức, kết nối những con người có cùng đam mê và xây dựng một cộng đồng thưởng thức văn minh, sành điệu.</p>
                                <blockquote>
                                    "Đối với tôi, rượu không chỉ là một thức uống. Đó là một hành trình khám phá, một tác phẩm nghệ thuật, và là cầu nối giữa những con người."
                                </blockquote>
                                <p>Dưới sự dẫn dắt của anh, AnSan đã và đang khẳng định vị thế của mình là một địa chỉ uy tín, nơi khách hàng không chỉ tìm thấy những sản phẩm chất lượng mà còn nhận được sự tư vấn tận tâm và những trải nghiệm độc đáo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
