import { sampleBlogPosts } from "@/lib/placeholder-data";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
    return (
        <div className="container py-12">
            <div className="text-center mb-10">
                <h1 className="font-headline text-4xl font-bold">Tin Tức & Kiến Thức</h1>
                <p className="mt-2 text-lg text-muted-foreground">Cập nhật những thông tin mới nhất và khám phá kiến thức thú vị về thế giới rượu vang.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sampleBlogPosts.map(post => (
                    <Link href={`/tin-tuc/${post.slug}`} key={post.id} className="group">
                        <Card className="overflow-hidden h-full transition-shadow duration-300 hover:shadow-xl">
                            <div className="overflow-hidden">
                                <Image 
                                    src={post.image.imageUrl} 
                                    alt={post.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                    data-ai-hint={post.image.imageHint}
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-muted-foreground">{post.date}</p>
                                <h2 className="font-headline text-xl font-semibold mt-2 group-hover:text-primary transition-colors">{post.title}</h2>
                                <p className="mt-3 text-muted-foreground text-sm">{post.excerpt}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
