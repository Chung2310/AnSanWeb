import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
const faqItems = [
    {
        question: "WHISKY KHÁC NHAU NHƯ THẾ NÀO THEO VÙNG SẢN XUẤT?",
        answer: "Mỗi quốc gia sản xuất Whisky có những đặc trưng riêng về quy trình, nguyên liệu và khí hậu. Ví dụ, Scotch Whisky thường mang hương vị đậm đà, khói do quá trình ủ trong thùng gỗ sồi, trong khi Whisky Nhật Bản thường tinh tế và cân bằng hơn. Những yếu tố này ảnh hưởng trực tiếp đến hương vị và trải nghiệm của mỗi chai Whisky."
    },
    {
        question: "LÀM SAO ĐỂ THƯỞNG THỨC WHISKY ĐÚNG CÁCH?",
        answer: "Thưởng thức whisky đúng cách là một nghệ thuật. Bạn có thể uống neat (nguyên chất), thêm vài giọt nước để mở ra hương vị, hoặc uống trên một viên đá lớn để làm lạnh từ từ mà không làm loãng rượu. Quan trọng nhất là hãy dành thời gian để cảm nhận hương thơm và từng lớp vị."
    },
    {
        question: "NHỮNG YẾU TỐ NÀO ẢNH HƯỞNG ĐẾN GIÁ CỦA MỘT CHAI WHISKY?",
        answer: "Giá của một chai whisky bị ảnh hưởng bởi nhiều yếu tố: tuổi rượu (thời gian ủ), sự khan hiếm (phiên bản giới hạn), danh tiếng của nhà chưng cất, loại thùng ủ được sử dụng, và chi phí nguyên liệu cũng như sản xuất."
    },
    {
        question: "ANSAN CÓ TỔ CHỨC SỰ KIỆN NÀO ĐỂ CHIA SẺ KIẾN THỨC KHÔNG?",
        answer: "Có, chúng tôi thường xuyên tổ chức các buổi tasting, workshop và sự kiện gặp gỡ chuyên gia để chia sẻ kiến thức và đam mê về whisky. Vui lòng theo dõi trang tin tức hoặc mạng xã hội của chúng tôi để cập nhật lịch sự kiện mới nhất."
    },
    {
        question: "LÀM SAO ĐỂ TRỞ THÀNH THÀNH VIÊN CỦA SPIRIT CLUB?",
        answer: "Để trở thành thành viên của Spirit Club và nhận những ưu đãi độc quyền, bạn chỉ cần đăng ký tài khoản trên website của chúng tôi và tham gia vào các hoạt động cộng đồng. Thành viên sẽ được ưu tiên tham gia sự kiện và nhận các thông tin đặc biệt."
    }
]

export default function FaqSection() {
    return (
        <section className="py-20" style={{backgroundColor: '#fdfaf5'}}>
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Câu Hỏi Thường Gặp
                </h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index + 1}`} key={index}>
                            <AccordionTrigger className="text-left font-bold text-sm tracking-wider hover:no-underline" style={{color: '#5a5a5a'}}>
                                {index + 1}. {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base leading-relaxed" style={{color: '#5a5a5a'}}>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
