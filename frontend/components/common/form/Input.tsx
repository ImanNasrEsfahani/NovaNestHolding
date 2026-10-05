// import { useForm, UseFormRegister, FieldValues } from 'react-hook-form';

export default function Input({
  id,
  register,
  errors,
  nameInput,
  type,
  label,
  required,
  patternValue,
  placeholder,
  patternMessage,
  className,
  labelClass,
  containerClass,
  validate,
}: {
  id: string;
  register: any;
  errors: any;
  nameInput: string;
  type: string;
  label?: string;
  required: string | boolean | undefined;
  patternValue: string;
  patternMessage: string;
  placeholder: string;
  className: string;
  labelClass?: string;
  containerClass?: string;
  inputValue?: string;
  validate?: any;
}) {

  const value = patternValue ? new RegExp(patternValue) : undefined;

  // treat empty string / undefined / false as NOT required
  const isRequired =
    required !== undefined &&
    required !== false &&
    !(typeof required === 'string' && required.trim() === '');

  const registerOptions: any = {};
  if (isRequired) {
    registerOptions.required = typeof required === 'string' ? required : true;
  }
  if (value) registerOptions.pattern = { value, message: patternMessage };
  if (validate) registerOptions.validate = validate;

  return (
    <div className={`flex flex-col items-start ${containerClass ?? ''}`}>
      <label htmlFor={id} className={`w-full px-2 text-gray ${labelClass ?? ''}`}>
        <span className="pl-1">
          {label}
          {isRequired ? <span className="text-red-500 ml-1">*</span> : null}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded border border-gray-400 px-4 py-2 text-sm placeholder:text-[#939393B2] focus:outline-none focus:ring-1 focus:ring-primary ${className} ${errors[nameInput] ? 'border-red-500' : ''}`}
          {...register(nameInput, {
            required,
            pattern: patternValue
              ? {
                value: new RegExp(patternValue),
                message: patternMessage
              }
              : undefined,
            validate // <-- forward custom validators (e.g. birthValidate)
          })}
        />
      </label>
      {errors[nameInput] && (
        <span className="pl-4 text-xs text-red-500">
          {errors[nameInput].message}
        </span>
      )}

    </div>
  );
}
