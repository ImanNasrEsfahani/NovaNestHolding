'use client'
import React from 'react';
import Image from 'next/image';
import ButtonRefactor from '@/components/common/ButtonRefactor';

type Props = {
  image: string;
  subTitle: string;
  text: string;
  goto: string;
  buttonText: string;
}

export default function UpcomingStartupsCard({ image, subTitle, text, goto, buttonText }: Props) {

  return (
      <div className='w-full md:w-[30%] mb-16 md:mb-0'>
        <div className='flex h-full flex-col justify-start rounded-xl px-5 md:pt-5 get-shadow-g shadow-2xl md:gap-x-8'>
          <div className='relative m-auto bg-white md:w-full'>
            <Image
              loading='lazy'
              className='m-auto h-[170px] w-60 object-contain pt-5'
              src={image}
              alt={subTitle}
              width={500}
              height={500}
            />
          </div>
          <div className="self-center p-2 font-header text-bold text-2xl font-normal leading-normal">
            {subTitle}
          </div>
          <div className='flex h-full flex-col gap-4 my-8'>
            {/* <div className='w-full px-3 md:px-0'>
              <hr className='h-[2px] w-full bg-black' />
            </div> */}
            <div className='flex h-full flex-col items-center justify-between gap-3 '>
              <div>
                <p className='text-lg md:text-lg'>
                  {text}
                </p>
              </div>
              <div className="mt-3 h-auto w-[224px] p-2">
                <ButtonRefactor
                  text={buttonText}
                  type="link"
                  href={goto}
                  bgColor="black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
