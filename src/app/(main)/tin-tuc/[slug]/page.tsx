import { sampleBlogPosts } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = sampleBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Formatting date for display
  const date = new Date(post.date);
  const formattedDate = `${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

  return (
    <div className="container py-12">
      <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <p className="text-muted-foreground">{formattedDate}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2">{post.title}</h1>
        </div>
        <Image 
            src={post.image.imageUrl} 
            alt={post.title}
            width={1200}
            height={600}
            className="w-full rounded-lg mb-8"
            data-ai-hint={post.image.imageHint}
        />
        <p>{post.excerpt}</p>
        <p>Đây là nơi nội dung chi tiết của bài viết sẽ được hiển thị. Hiện tại, chúng tôi chỉ sử dụng một đoạn văn bản mẫu. Nội dung thực tế sẽ được tìm nạp từ CMS hoặc cơ sở dữ liệu.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. </p>
        <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.</p>
      </article>
    </div>
  );
}
