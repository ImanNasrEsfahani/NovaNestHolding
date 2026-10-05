import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

type FileUploadProps = {
  nameInput: string;
  label: string;
  onChange: (file: File | null) => void;
  disabled: boolean;
  required?: string | boolean;
  errors: any;
  file: File | string | null;
}

interface FileUploadRef {
  clearFile: () => void;
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(({ nameInput, label, onChange, disabled, required, errors, file }, ref) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // keep internal UI in sync with external file value (clear when parent resets)
  useEffect(() => {
    if (!file) {
      setFileName(null);
      if (inputRef.current) inputRef.current.value = '';
    } else {
      setFileName(file instanceof File ? file.name : String(file));
    }
  }, [file]);
  
  const handleChange = (file: File | null) => {
    setFileName(file ? file.name : null);
    onChange(file);
  };

  const clearFile = () => {
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  };

  useImperativeHandle(ref, () => ({
    clearFile,
  }));

  // show invalid state if RHF reports an error for this field
  // or when the field is required but no file selected and the form has validation errors (submit attempted)
  const hasAnyErrors = errors && Object.keys(errors).length > 0;
  const showInvalid = !!errors?.[nameInput] || (required && !fileName && hasAnyErrors);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        className={`relative w-full p-4 flex flex-col items-center justify-center cursor-pointer rounded bg-whiteGold hover:bg-gray-200 transition
          ${ showInvalid ? 'border-2 border-red-500 ring-1 ring-red-200' : '' }`}
      >
        <p className="font-base mb-2">{label}</p>
        <input
          ref={inputRef}
          id={nameInput}
          type="file"
          name={nameInput}
          className="absolute opacity-0"
          required={!!required}
          aria-required={!!required}
          aria-invalid={showInvalid}
          onChange={(e) => handleChange(e.target.files?.[0] || null)}
          disabled={disabled}
        />
        {/* show filename if a file is selected */}
        {fileName?.trim() ? (
          <div className="mt-3 flex items-center gap-3 w-full justify-center">
            <span className="text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-[70%]">{fileName}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
              aria-label="Remove file"
            >
              Remove
            </button>
          </div>
        ) : null}
      </label>

      {showInvalid && (
        <span className="mt-2 inline text-sm text-red-500">
          {errors?.[nameInput]?.message ?? 'Please upload a file.'}
        </span>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
