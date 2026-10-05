import ButtonRefactor from '@/components/common/ButtonRefactor';

interface AboutUsProps {
  lang: string;
  translations: {
    AboutUs: string;
    AboutUsContent: string[];
    ReadMore?: string;
  };
  href?: string;
}

export default function AboutUs({ lang, translations, href }: AboutUsProps) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center mt-24 mb-16">
      <h1 className="text-2xl md:text-4xl font-header font-bold mb-6">
        {translations.AboutUs}
      </h1>

      {translations.AboutUsContent.map((item, i) => (
        <p key={i} className="text-lg text-center mb-2">
          {item}
        </p>
      ))}

      {translations.ReadMore && href && (
        <div className="max-w-container-xxs mt-9">
          <ButtonRefactor
            text={translations.ReadMore}
            type="link"
            href={`${base}${href}`}
            bgColor="black"
          />
        </div>
      )}
    </div>
  );
}
