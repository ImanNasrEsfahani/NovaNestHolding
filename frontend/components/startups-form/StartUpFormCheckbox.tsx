'use client'

import { StartupsFormDataType } from '@/types/global';
import React, { useEffect, useState } from 'react'
import { UseFormRegister } from 'react-hook-form';
import { useSubmit } from '../../stores/dataStore';

type Props = {
    name: string
    register: UseFormRegister<StartupsFormDataType>
}

export default function StartUpFormCheckbox(props: Props) {

  const { name, register } = props;
  const {
    startupFormType, 
    setStartUpFormType
  } = useSubmit((s) => s)

  const [checked, setChecked] = useState(startupFormType == name);

  useEffect(() => {
    setChecked(startupFormType == name)
  },[startupFormType, name])

    
  return (
    <div className='w-full h-auto bg-whiteGold drop-shadow-md px-2 py-4'>
        <div className='w-full h-auto flex flex-row items-center gap-2 cursor-pointer' onClick={() => setStartUpFormType(name)}>
            <div className='border-2 rounded-full border-primary p-1'>
                <div
                    className={`size-4 rounded-full transition-all ${
                      checked ? "bg-primary" : "bg-whiteGold"
                    }`}
                >
                  <input 
                    type='radio'
                    className='size-full inset-0 opacity-0'
                    value={name}
                    {...register("startupType", {
                      required: true,
                    })}
                    name="startupType"
                  />
                </div>
            </div>
            <p id={name} className='font-barlow font-medium'>{name}</p>
        </div>
    </div>
  )
}