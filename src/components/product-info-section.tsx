'use client';
import type { ProductStructuredDetails } from "@/lib/types";
import { Separator } from "./ui/separator";

const NoseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M26.25 35C26.25 38.4518 29.0482 41.25 32.5 41.25C35.9518 41.25 38.75 38.4518 38.75 35C38.75 31.5482 35.9518 28.75 32.5 28.75C29.0482 28.75 26.25 31.5482 26.25 35Z" stroke="#8A7D6A" strokeWidth="1.5"/>
        <path d="M22.5 13.75C23.5 15.25 25 18.25 23.75 20C22.5 21.75 21.25 21.25 20 21.25" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M27.5 16.25C28.5 17.75 30 20.75 28.75 22.5C27.5 24.25 26.25 23.75 25 23.75" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32.5 18.75C33.5 20.25 35 23.25 33.75 25C32.5 26.75 31.25 26.25 30 26.25" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22.5 41.25H16.25C15.8286 41.25 15.429 41.0854 15.1368 40.7933C14.8446 40.5011 14.6799 40.1015 14.6799 39.68C14.6799 37.13 16.25 35 16.25 35L26.25 35" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M38.75 35L48.75 35C48.75 35 50.3201 37.13 50.3201 39.68C50.3201 40.1015 50.1554 40.5011 49.8632 40.7933C49.571 41.0854 49.1714 41.25 48.75 41.25H42.5" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32.5 41.25V47.5H30" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const PalateIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20 21.25L42.5 21.25C42.5 21.25 47.5 22.5 47.5 28.75C47.5 35 42.5 36.25 42.5 36.25L20 36.25C20 36.25 15 35 15 28.75C15 22.5 20 21.25 20 21.25Z" stroke="#8A7D6A" strokeWidth="1.5"/>
        <path d="M31.25 36.25V42.5H28.75" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.25 33.75C21.25 33.75 22.5 30 25 30C27.5 30 28.75 33.75 28.75 33.75" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const FinishIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22.5 21.25L35 21.25C35 21.25 40 22.5 40 28.75C40 35 35 36.25 35 36.25L22.5 36.25C22.5 36.25 17.5 35 17.5 28.75C17.5 22.5 22.5 21.25 22.5 21.25Z" stroke="#8A7D6A" strokeWidth="1.5"/>
        <path d="M37.5 21.25L50 21.25C50 21.25 55 22.5 55 28.75C55 35 50 36.25 50 36.25L37.5 36.25" stroke="#8A7D6A" strokeWidth="1.5"/>
        <path d="M26.25 36.25V42.5H23.75" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M43.75 36.25V42.5H41.25" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28.75 16.25L32.5 12.5" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M36.25 16.25L40 12.5" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32.5 18.75L36.25 15" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ColorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M33.75 25V33.75C33.75 33.75 28.75 37.5 28.75 40V45H43.75V40C43.75 37.5 38.75 33.75 38.75 33.75V25" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.25 21.25C21.25 21.25 23.125 18.75 27.5 18.75C31.875 18.75 33.75 21.25 33.75 21.25V25H21.25V21.25Z" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M27.5 18.75C27.5 16.25 23.75 13.75 21.25 12.5C18.75 11.25 16.25 11.25 16.25 12.5C16.25 13.75 18.75 16.25 20 18.75" stroke="#8A7D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const InfoItem = ({ label, value }: { label: string, value?: string }) => {
    return (
        <div className="text-center">
            <p className="text-xs uppercase tracking-widest" style={{color: '#8a7d6a'}}>{label}</p>
            <p className="mt-1 font-bold text-sm" style={{color: '#5a5a5a'}}>{value || 'NONE'}</p>
        </div>
    );
};

const NoteCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text?: string }) => {
    return (
        <div className="p-8" style={{backgroundColor: '#F5F1EB'}}>
            <div className="flex justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-center font-bold uppercase tracking-widest text-xs mb-3" style={{color: '#8a7d6a'}}>{title}</h3>
            <p className="text-center text-sm leading-relaxed" style={{color: '#5a5a5a'}}>{text || 'NONE'}</p>
        </div>
    );
};


export default function ProductInfoSection({ details }: { details: ProductStructuredDetails }) {
    const { brand, chillFiltered, region, caskType, tastingNote } = details;
    
    const noteCards = [
        { icon: <NoseIcon />, title: "MÙI HƯƠNG", text: tastingNote?.nose },
        { icon: <PalateIcon />, title: "HƯƠNG VỊ", text: tastingNote?.palate },
        { icon: <FinishIcon />, title: "HẬU VỊ", text: tastingNote?.finish },
        { icon: <ColorIcon />, title: "MÀU SẮC", text: tastingNote?.color },
    ];
    
    const infoItems = [
        { label: "THƯƠNG HIỆU", value: brand },
        { label: "LỌC LẠNH", value: chillFiltered },
        { label: "VÙNG SẢN XUẤT", value: region },
        { label: "LOẠI THÙNG", value: caskType },
    ];

    return (
        <section className="py-20" style={{backgroundColor: '#fdfaf5'}}>
            <div className="container">
                <h2 className="text-center font-headline text-4xl font-black uppercase mb-10" style={{color: '#5a5a5a'}}>
                    Thông Tin Sản Phẩm
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
                   {infoItems.map(item => <InfoItem key={item.label} {...item} />)}
                </div>
                
                <Separator className="max-w-xs mx-auto my-12 bg-gray-200" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {noteCards.map((card, index) => (
                        <NoteCard key={index} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
