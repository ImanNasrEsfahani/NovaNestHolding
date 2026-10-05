import React from 'react';

interface Props {
  formTitle: string;
  formSubtitle: string;
}

export default function FormTitle({ formTitle, formSubtitle }: Props) {
  return (
    <div className={`size-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg flex items-center justify-center`}>
      <div className='text-center px-4'>
          <h3 className="text-white font-header font-medium text-lg md:text-3xl">
            {formTitle}
          </h3>
          <p className="hidden lg:block text-white font-header font-light text-md mt-2">
            {formSubtitle}
          </p>
      </div>
    </div>
  )
}
