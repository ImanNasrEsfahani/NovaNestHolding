'use Client';
import React, { useState } from 'react';
import FileUpload from '@/components/common/form/FileUpload';
import YesOrNoQuestion from './YesOrNoQuestion';
import { useFile } from 'stores/fileStore';

interface Props {
  title: string;
  yesLabel: string;
  noLabel: string;
  chooseFile: string;
  onFileChange: (file: any) => void;
  errors: any;
  required: boolean;
}


export default function BusinessPlanUpload({ title, yesLabel, noLabel, chooseFile, onFileChange, errors, required }: Props) {
  const [fileCounterState, setFileCounter] = useState<boolean>(false);

  return (
    <div className='w-full flex flex-col items-center mb-12'>
      <YesOrNoQuestion
        title={title}
        yesLabel={yesLabel}
        noLabel={noLabel}
        value={fileCounterState}
        onChange={setFileCounter}
        name="fileCounter"
      />

      <div
        aria-hidden={!fileCounterState}
        className={`w-full md:max-w-lg 2xl:max-w-xl mx-auto mt-2 bg-whiteGold drop-shadow-md justify-center overflow-hidden
          transition-[max-height,opacity,transform,padding] duration-700 ease-out min-h-0
          ${fileCounterState ? 'max-h-auto opacity-100 translate-y-0 py-4 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none'}`}
      >
        <FileUpload
          nameInput="businessPlanFile"
          required={fileCounterState ? true : false}
          errors={errors}
          label={chooseFile}
          onChange={onFileChange}
          disabled={!fileCounterState}
          file=""
        />
      </div>
    </div>
  );
};