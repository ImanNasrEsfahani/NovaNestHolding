export default function Select({
  register,
  errors,
  nameInput,
  label,
  required,
  options,
  className,
  labelClass,
  placeholder,
  handleChange
}: {
  register: any;
  errors: any;
  nameInput: string;
  label: string;
  required: string;
  options: { value: string; label: string }[];
  className: string;
  labelClass: string;
  placeholder: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selected?: string;
}) {
  // get register props and separate onChange so we can call both handlers
  const regProps = register ? register(nameInput, { required: required }) : {};
  const { onChange: regOnChange, ...restReg } = regProps as any;

  return (
    <>
      <label
        htmlFor={nameInput}
        className={`flex flex-col px-2 ${labelClass}`}
      >
        <span className="pl-1">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </span>

        <div className="relative">
          <select
            id={nameInput}
            {...restReg}
            onChange={(e) => {
              // first let RHF handle the change (update value / clear error), then call custom handler
              regOnChange?.(e);
              handleChange?.(e);
            }}
            className={`w-full !rounded-sm border border-gray-400 appearance-none bg-transparent placeholder:text-[#939393B2] pr-10 ${className} ${errors[nameInput] ? ' border-red-500' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </label>

      {errors[nameInput] && (
        <span className="pl-4 text-xs text-red-500 -m-t-2">
          {errors[nameInput].message}
        </span>
      )}
    </>
  );
}
