import React, { useId } from 'react';

export default function Input({
  type = 'text',
  label,
  description,
  name,
  id,
  value,
  defaultValue,
  placeholder,
  onChange,
  required,
  spellcheck,
  pattern,
  errors,
}: {
  type: 'text' | 'number' | 'password' | 'email' | 'search';
  label?: string;
  description?: string;
  name: string;
  id: string;
  value: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  spellcheck?: boolean;
  pattern?: string;
  errors?:
    | {
        [x: string | number | symbol]: string[] | undefined;
      }
    | undefined;
}) {
  const unique = useId();

  const [, fieldErrors] =
    Object.entries(errors || {}).find(([key]) => key === name) || [];

  const uniqueKey = name || id || unique;

  return (
    <>
      {label && (
        <label
          id={`label-${id}`}
          htmlFor={uniqueKey}
          className="mb-2 block font-semibold text-gray-700"
        >
          {label}
        </label>
      )}
      {description ? <p className="mb-2 text-sm">{description}</p> : null}
      <div className="mb-2">
        <input
          type={type}
          aria-labelledby={label ? `label-${id}` : undefined}
          name={uniqueKey}
          id={uniqueKey}
          className={[
            'mb-2 w-full rounded-md border-gray-300 text-black shadow-sm',
            fieldErrors ? 'border-red-600' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          spellCheck={
            spellcheck !== undefined ? spellcheck : type !== 'password'
          }
          onChange={onChange}
          required={required}
          pattern={pattern}
        />
        {fieldErrors &&
          fieldErrors.map((fieldError, errorIndex) => (
            <p key={errorIndex} className="py-1 text-sm text-red-600">
              ⚠️ {fieldError}
            </p>
          ))}
      </div>
    </>
  );
}
