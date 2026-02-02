
'use client';

import { useHydration } from '@/hooks/use-hydration';

export default function MapEmbed() {
    const isHydrated = useHydration();

    if (!isHydrated) {
        // Render a placeholder on the server and during the initial client render
        return <div style={{ height: '450px', width: '100%', backgroundColor: 'hsl(var(--muted))' }} />;
    }

    return (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.503380421711!2d105.95849617599663!3d21.11884318497626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313507d363d71ddb%3A0x7a29b7c779b993e1!2zUsaw4bujdSBWYW5nIEFuIFNhbg!5e0!3m2!1sen!2s!4v1688888888888!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
}
