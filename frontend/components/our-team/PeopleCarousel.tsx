'use client';

import PersonCard from './PersonCard';
import { Person } from '@/types/global';
import useSeamlessAutoScroll from './useSeamlessAutoScroll';
import styles from './PeopleCarousel.module.css';

type Props = {
  people: Person[];
};

const copies = [0, 1, 2] as const;

export default function PeopleCarousel({ people }: Props) {
  const { scrollerRef, middleGroupRef, repeats, isLooping } = useSeamlessAutoScroll(people.length, 15);

  if (!people.length) return null;

  return (
    <section className="relative w-full">
      <div
        ref={scrollerRef}
        dir="ltr"
        tabIndex={isLooping ? 0 : undefined}
        aria-label="Mentors carousel"
        className={`${styles.scrollContainer} overflow-x-auto overflow-y-hidden px-4 py-4 md:px-6`}
      >
        <div className="flex w-max min-w-full items-stretch justify-center">
          {(isLooping ? copies : [1]).map((groupNumber) => (
            <div
              key={groupNumber}
              ref={groupNumber === 1 ? middleGroupRef : undefined}
              className={`flex shrink-0 items-stretch gap-6 md:gap-8 ${isLooping ? 'pr-6 md:pr-8' : ''}`}
            >
              {Array.from({ length: isLooping ? repeats : 1 }, (_, repetition) =>
                people.map((person, index) => {
                  const duplicate = groupNumber !== 1 || repetition !== 0;
                  return (
                    <div
                      key={`${groupNumber}-${repetition}-${person.slug || index}-${index}`}
                      aria-hidden={duplicate || undefined}
                      className="w-[76vw] max-w-72 shrink-0 sm:w-64 md:w-72"
                    >
                      <PersonCard person={person} duplicate={duplicate} />
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
