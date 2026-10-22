'use client';

import PersonCard from './PersonCard';
import { Person } from '@/types/global';
import useSeamlessAutoScroll from './useSeamlessAutoScroll';
import styles from './PeopleCarousel.module.css';

type Props = { people: Person[] };
const copies = [0, 1, 2] as const;

export default function PeopleCarousel({ people }: Props) {
  const { scrollerRef, middleGroupRef, repeats, isLooping, moveBy } = useSeamlessAutoScroll(people.length);
  if (!people.length) return null;

  return (
    <section className="relative w-full">
      {isLooping && (
        <div className="mb-3 flex justify-end gap-2" dir="ltr">
          <button type="button" aria-label="Scroll mentors left" onClick={() => moveBy(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">←</button>
          <button type="button" aria-label="Scroll mentors right" onClick={() => moveBy(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">→</button>
        </div>
      )}
      <div ref={scrollerRef} dir="ltr" tabIndex={isLooping ? 0 : undefined} aria-label="Mentors carousel"
        className={`${styles.scrollContainer} overflow-x-auto overflow-y-hidden px-4 py-4 md:px-6`}>
        <div className="flex w-max min-w-full items-stretch justify-center">
          {(isLooping ? copies : [1]).map((groupNumber) => (
            <div key={groupNumber} ref={groupNumber === 1 ? middleGroupRef : undefined}
              className={`flex shrink-0 items-stretch gap-6 md:gap-8 ${isLooping ? 'pr-6 md:pr-8' : ''}`}>
              {Array.from({ length: isLooping ? repeats : 1 }, (_, repetition) =>
                people.map((person, index) => {
                  const duplicate = groupNumber !== 1 || repetition !== 0;
                  return (
                    <div key={`${groupNumber}-${repetition}-${person.slug || index}-${index}`}
                      aria-hidden={duplicate || undefined}
                      className="flex h-auto min-h-[560px] w-[76vw] max-w-72 shrink-0 self-stretch sm:w-64 md:min-h-[590px] md:w-72">
                      <div className="w-full h-full"><PersonCard person={person} duplicate={duplicate} /></div>
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
