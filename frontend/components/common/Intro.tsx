type Props = {
    title: string;
    subtitle: string;
    description: string | string[];
};

export default function Intro({
    title,
    subtitle,
    description
}: Props) {
    const isArray = Array.isArray(description);

    return (
        <div className="w-full max-w-responsive mx-auto flex justify-center items-center pt-16 pb-9">
            <div className="w-full mx-auto text-center">
                {title && (
                    <h1 className="text-4xl md:text-5xl font-header font-bold mb-1 text-gray-800 leading-relaxed">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <h2 className="text-lg italic font-header font-semibold mb-4 text-gray-600 leading-relaxed">
                        {subtitle}
                    </h2>
                )}
                {description && (
                    <div className="mt-2">
                        {isArray ? (
                            (description as string[]).map((t, i) => (
                                <p className="text-base text-justify" key={i}>
                                    {t}
                                </p>
                            ))
                        ) : (
                            <p className="text-base text-justify">{description}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}