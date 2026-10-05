import Image from "next/image";

interface TwoColumnShowcaseProps {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    imageSrc: string;
    imageAlt: string;
    imageLogoSrc: string;
    imageLogoAlt: string;
    reverse?: boolean;
    className?: string;
}

export default function TwoColumnShowcase({
    title,
    description,
    buttonText,
    buttonUrl,
    imageSrc,
    imageAlt,
    imageLogoSrc,
    imageLogoAlt,
    reverse = false,
    className = ""
}: TwoColumnShowcaseProps) {
  return (
    <div className={`flex flex-col-reverse md:flex-row gap-10 items-center justify-between ${reverse ? "md:flex-row-reverse" : ""} ${className}`}>
      <div className="flex flex-col h-full items-start justify-between gap-8 md:w-1/2">
        <div className="flex items-center gap-4">
          <Image
            loading="lazy"
            className="object-contain mb-2"
            src={imageLogoSrc}
            alt={imageLogoAlt}
            width={48}
            height={48}
            style={{ height: '2em', width: 'auto' }}
          />
          <span className="font-header text-4xl font-bold">{title}</span>
        </div>
        <p className="text-justify text-base md:w-full">{description}</p>
        <a
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg shadow hover:bg-primary transition-colors"
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {buttonText}
        </a>
      </div>
      <div className="flex size-full md:w-1/2 md:pb-0 justify-center">
        <Image
          loading="lazy"
          className="rounded-lg object-cover h-full w-auto"
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={300}
        />
      </div>
    </div>
  );
}