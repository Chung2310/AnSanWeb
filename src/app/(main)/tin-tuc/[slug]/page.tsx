import { sampleBlogPosts } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import PostSidebar from "@/components/post-sidebar";
import TableOfContents from "@/components/table-of-contents";

// This is a placeholder for a function that would parse content and extract headings
const generateHeadings = (content: string) => {
    // In a real app, you'd parse the content to find h2, h3, etc.
    // For now, we'll use a static example based on the UI.
    return [
        { id: "giai-doan-lich-su", text: "MỘT GIAI ĐOẠN LỊCH SỬ QUAN TRỌNG CỦA LAPHROAIG", level: 2 },
        { id: "qua-trinh-truong-thanh", text: "QUÁ TRÌNH TRƯỞNG THÀNH PHỨC HỢP", level: 2 },
        { id: "thiet-ke-ton-vinh", text: "THIẾT KẾ TÔN VINH DI SẢN ISLAY", level: 2 },
        { id: "gioi-han-phat-hanh", text: "GIỚI HẠN PHÁT HÀNH TOÀN CẦU - GIÁ TRỊ SƯU TẦM ĐỈNH CAO", level: 2 },
    ];
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = sampleBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const headings = generateHeadings(post.excerpt); 

  const date = new Date(post.date);
  const formattedDate = `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return (
    <div className="bg-white text-black py-16">
        <div className="container max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-8">
                    <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest mb-6" style={{color: '#8a7d6a'}}>
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           <span>BY {post.author || 'AnSan'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {post.categories.map(cat => (
                                <Link key={cat} href="#" className="hover:text-black">{cat}</Link>
                            ))}
                        </div>
                    </div>
                    
                    <h1 className="font-headline text-4xl font-black uppercase text-neutral-700 mb-8">
                        {post.title}
                    </h1>

                    <TableOfContents headings={headings} />
                    
                    <article className="prose prose-lg max-w-none" style={{color: '#5a5a5a'}}>
                        <p className="font-bold italic">
                          Chỉ có 400 chai được phát hành toàn cầu, giá bán lẻ lên tới 4.300 USD. 
                          Laphroaig vừa công bố phiên bản thứ hai trong dòng Archive Collection – một chai single malt 38 năm tuổi, chưng cất vào năm 1985, thuộc thời kỳ chuyển mình đầy biến động của nhà chưng cất Islay này. Đây là một trong những chai whisky hiếm nhất còn sót lại từ giai đoạn đặc biệt ấy.
                        </p>
                        
                        <h2 id="giai-doan-lich-su" className="font-headline font-black uppercase text-2xl !mt-12 !mb-6" style={{color: '#5a5a5a'}}>
                          Một Giai Đoạn Lịch Sử Quan Trọng Của Laphroaig
                        </h2>
                        <p>
                          Thập niên 1980 là thời kỳ đầy thách thức với Laphroaig: sản lượng giảm mạnh trong khi nhà máy tiến hành hàng loạt đợt cải tạo lớn, bao gồm cả việc xây dựng nhà chưng cất (stillhouse) mới. Chai whisky này đại diện cho những mẻ chưng cất cuối cùng sử dụng hệ thống truyền thống – trước khi các nồi chưng cất và bộ ngưng tụ được chuyển vào không gian kín lần đầu tiên trong lịch sử.
                        </p>
                        
                        <h2 id="qua-trinh-truong-thanh" className="font-headline font-black uppercase text-2xl !mt-12 !mb-6" style={{color: '#5a5a5a'}}>
                          Quá Trình Trưởng Thành Phức Hợp
                        </h2>
                        <Image 
                            src={post.image.imageUrl} 
                            alt={post.title}
                            width={1200}
                            height={600}
                            className="w-full rounded-lg my-8"
                            data-ai-hint={post.image.imageHint}
                        />
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.
                        </p>
                        <p>
                          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.
                        </p>

                        <h2 id="thiet-ke-ton-vinh" className="font-headline font-black uppercase text-2xl !mt-12 !mb-6" style={{color: '#5a5a5a'}}>
                          Thiết Kế Tôn Vinh Di Sản Islay
                        </h2>
                        <p>Nội dung đang được cập nhật...</p>

                        <h2 id="gioi-han-phat-hanh" className="font-headline font-black uppercase text-2xl !mt-12 !mb-6" style={{color: '#5a5a5a'}}>
                           Giới Hạn Phát Hành Toàn Cầu - Giá Trị Sưu Tầm Đỉnh Cao
                        </h2>
                        <p>Nội dung đang được cập nhật...</p>
                    </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                    <PostSidebar currentPostId={post.id} />
                </div>
            </div>
        </div>
    </div>
  );
}
