import BrandStory from "@/components/homepage/brand-story";
import Testimonials from "@/components/homepage/testimonials";

export default function AboutPage() {
    return (
        <>
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container text-center">
                    <h1 className="font-headline text-5xl font-bold">Về Chúng Tôi</h1>
                    <p className="mt-4 text-xl max-w-3xl mx-auto text-primary-foreground/80">
                        Niềm đam mê của chúng tôi là mang những chai vang tuyệt hảo nhất từ khắp thế giới đến với bạn.
                    </p>
                </div>
            </div>
            <BrandStory />
            <Testimonials />
        </>
    )
}
