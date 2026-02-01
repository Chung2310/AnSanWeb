'use client';

import { useState, useEffect } from 'react';

export default function MapEmbed() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        // Render a placeholder or nothing on the server and during initial client render
        return <div className="w-full h-[450px] bg-muted animate-pulse" />;
    }

    return (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!2d105.9610764153835!3d21.11884318599496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313507d363d71ddb%3A0x7a29b7c779b993e1!2zUsaw4bujdSBWYW5nIEFuIFNhbg!5e0!3m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
}
