import PriorityCard from './PriorityCard';

interface PriorityProps {
  Priorities: string;
  cardData: Array<{ title: string; image: string }>;
  mobileCol?: number;
}

export default function Priority({ Priorities, cardData, mobileCol = 1 }: PriorityProps) {
  const colClass =
    { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[mobileCol] ||
    'grid-cols-1';

  return (
    <section className="w-full max-w-responsive mx-auto py-12 lg:py-24 text-center">
      <h3 className="text-4xl font-header font-bold mb-20 text-gray-800">
        {Priorities}
      </h3>

      <div className={`grid ${colClass} lg:grid-cols-4 gap-8 place-items-center`}>
        {cardData.map(({ title, image }, index) => (
          <PriorityCard key={index} title={title} image={image} />
        ))}
      </div>
    </section>
  );
}
