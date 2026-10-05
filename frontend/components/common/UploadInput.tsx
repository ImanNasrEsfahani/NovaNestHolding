import UploadIcon from '@/components/icons/UploadIcon';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  title: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  nameInput: string;
  handleChange: (file: File) => void;
  required?: boolean | string;
}

export default function UploadInput({
  title,
  register,
  errors,
  nameInput,
  handleChange,
  required
}: Props) {
  return (
    <div className="inline-flex max-w-full flex-col justify-center gap-3">
      {/* Label for the upload input */}
      <div className="self-start px-2 text-lg font-normal text-neutral-800">{title}</div>

      {/* Container for the upload input */}
      <div className="inline-flex items-center justify-center gap-[5px] rounded-md bg-stone-100 px-6 py-2 shadow">
        {/* Upload icon */}
        <UploadIcon />

        {/* The actual input */}
        <input
          className={`h-7 text-lg font-normal capitalize text-neutral-800 ${errors[nameInput] ? ' border-red-500' : ''}`}
          type="file"
          {...register(nameInput, { required })}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleChange(file);
          }}
        />
        {errors[nameInput] && (
          <span className="mt-4 text-sm text-red-500">
            {String(errors[nameInput]?.message || 'Required')}
          </span>
        )}
      </div>
    </div>
  );
}
