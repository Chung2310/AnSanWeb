import Image from "next/image";

export default function AboutPage() {
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
                            <Image 
                                src="/images/Tabi-2014-600x900.jpg"
                                alt="Nhà sáng lập AnSan - Ông Phạm Đăng Thành"
                                width={600}
                                height={900}
                                className="rounded-lg w-full h-auto object-cover shadow-2xl"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="font-headline text-4xl font-bold text-foreground">Phạm Đăng Thành</h2>
                            <p className="text-primary font-semibold mt-1">CEO & Founder</p>
                            <div className="prose prose-lg dark:prose-invert mt-6 max-w-none">
                                <p>Rượu vang đến với tôi như một cái duyên. Vào một lần tình cờ của năm 2017 tôi đã được hướng dẫn sử dụng rượu vang đúng chuẩn. Tôi rất bất ngờ tại sao lại có thức uống có cồn tuyệt vời đến như vậy. Từ đó tôi bắt đầu tìm hiểu về rươu vang và rất ngạc nhiên với lợi ích mà chúng mang tới.</p>
                                <p>Có lẽ rượu vang là 1 trong các số ít thức uống có cồn mà tốt cho sức khoẻ. Tôi đã say mê nó lúc nào không biết! Với niềm đam mê mãnh liệt và mong muốn cung cấp các sản phẩm rượu vang đúng giá trị đúng chất lượng mà Công ty TNHH Thương Mại và Xuất Nhập Khẩu An San ra đời.</p>
                                <p>Chúng tôi – Rượu vang An San không chỉ bán sản phẩm cho khách hàng mà chính gia đình, bạn bè và người thân biết tới An San đều sử dụng rượu vang. Vậy nên tất cả các sản phẩm bán ra từ An San đều được chọn lọc rất kĩ từ các nhà sản xuất rượu vang trên thế giới và phân phối lại các sản phẩm uy tín từ các nhà nhập khẩu tại Việt Nam.</p>
                                <blockquote>
                                    “Rượu vang An San nơi mang đến cho khách hàng không chỉ là thức rượu chính hãng mà hơn cả là nghệ thuật thưởng thức”
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
