import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Testimonials from "@/components/homepage/testimonials";


export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'brand-story');

    return (
        <>
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container text-center">
                    <h1 className="font-headline text-5xl font-bold">VỀ RƯỢU VANG AN SAN</h1>
                    <p className="mt-4 text-xl max-w-3xl mx-auto text-primary-foreground/80">
                       Nơi mang đến cho khách hàng không chỉ là thức rượu chính hãng mà hơn cả là nghệ thuật thưởng thức.
                    </p>
                </div>
            </div>
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {aboutImage && (
                            <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-xl">
                                <Image 
                                    src={aboutImage.imageUrl}
                                    alt={aboutImage.description}
                                    width={800}
                                    height={1000}
                                    className="h-full w-full object-cover"
                                    data-ai-hint={aboutImage.imageHint}
                                />
                            </div>
                        )}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p>Rượu vang đến với tôi như một cái duyên. Vào một lần tình cờ của năm 2017 tôi đã được hướng dẫn sử dụng rượu vang đúng chuẩn. Tôi rất bất ngờ tại sao lại có thức uống có cồn tuyệt vời đến như vậy. Từ đó tôi bắt đầu tìm hiểu về rươu vang và rất ngạc nhiên với lợi ích mà chúng mang tới.</p>
                            <p>Có lẽ rượu vang là 1 trong các số ít thức uống có cồn mà tốt cho sức khoẻ. Tôi đã say mê nó lúc nào không biết! Với niềm đam mê mãnh liệt và mong muốn cung cấp các sản phẩm rượu vang đúng giá trị đúng chất lượng mà Công ty TNHH Thương Mại và Xuất Nhập Khẩu An San ra đời với phương châm kinh doanh luôn đặt uy tín lên hàng đầu để mang đến cho khách hàng những chai rượu vang nhập khẩu chất lượng từ Pháp , Ý , Chile , Mỹ…….</p>
                            <p>Chúng tôi – Rượu vang An San không chỉ bán sản phẩm cho khách hàng mà chính gia đình, bạn bè và người thân biết tới An San đều sử dụng rượu vang. Vậy nên tất cả các sản phẩm bán ra từ An San đều được chọn lọc rất kĩ từ các nhà sản xuất rượu vang trên thế giới và phân phối lại các sản phẩm uy tín từ các nhà nhập khẩu tại Việt Nam.</p>
                             <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80">
                                “Rượu vang An San nơi mang đến cho khách hàng không chỉ là thức rượu chính hãng mà hơn cả là nghệ thuật thưởng thức”
                                <cite className="block not-italic mt-2 font-semibold">— Ông Phạm Đăng Thành – CEO của An San</cite>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>
            <Testimonials />
        </>
    )
}
