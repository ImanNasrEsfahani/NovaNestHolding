export default async function Banner({
  image,
  title,
  lang,
  backgroundPosition = 'center',
  backgroundSize = 'cover',
  className = ''
}: {
  image: string;
  title: string;
  lang: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  className?: string;
}) {
  
  return (
    <div className={`relative ${className} h-[80vh]`}>
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: backgroundPosition,
          backgroundSize: backgroundSize
        }}
        className="absolute inset-0 h-full flex items-center pb-24 lg:pb-0 px-4 md:px-20"
      >
        <div className="h-auto w-full">
          <div className="h-auto w-full flex flex-col items-start gap-4">
            <p className="text-white font-medium font-header text-md lg:text-xl" style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)', WebkitTextStroke: '2px gray', WebkitTextStrokeWidth: '2px', WebkitTextFillColor: 'white', paintOrder: 'stroke fill' }}>
              {lang == 'en' ? 'NovaNest Academy' : 'نووا نست آکادمی'}
            </p>
            <h1 className="text-white font-header font-semibold text-3xl lg:text-6xl" style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)', WebkitTextStroke: '2px gray', WebkitTextStrokeWidth: '2px', WebkitTextFillColor: 'white', paintOrder: 'stroke fill' }}>
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
