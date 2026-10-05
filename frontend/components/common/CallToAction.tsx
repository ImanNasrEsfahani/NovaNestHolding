import React from 'react';

interface Props {
    className?: string;
    text?: string | string[];
}

export default function CallToAction({
    className = '',
    text = 'callToAction',
}: Props) {
    const isArray = Array.isArray(text);

    return (
        <div className={`w-full max-w-responsive mx-auto text-center mb-4 ${className}`}>
            {isArray ? (
                (text as string[]).map((t, i) => (
                    <p className="text-xl md:text-2xl font-header" key={i}>
                        {t}
                    </p>
                ))
            ) : (
                <p className="text-xl md:text-2xl font-header">{text}</p>
            )}
        </div>
    );
}