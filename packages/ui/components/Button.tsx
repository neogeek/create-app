import React, { useRef } from 'react';

import { useDisabledFocus } from '@neogeek/common-react-hooks';

export default function ButtonComponent({
  type = 'button',
  disabled = false,
  onClick,
  children,
}: {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useDisabledFocus(ref, disabled);

  const styles = [
    'inline-flex items-center rounded border px-2.5 py-1.5 text-sm font-medium shadow-sm focus:outline-none',
  ];

  if (!disabled) {
    if (type === 'submit') {
      styles.push(
        'border-transparent bg-blue-600 text-white hover:bg-blue-700'
      );
    } else {
      styles.push('border-gray-300 bg-white text-gray-700 hover:bg-gray-50');
    }

    styles.push('focus:ring-2 focus:ring-offset-2 focus:ring-blue-500');
  } else {
    styles.push('text-gray-500');
  }

  return (
    <button
      ref={ref}
      role="button"
      type={type}
      onClick={onClick}
      className={styles.join(' ')}
    >
      {children}
    </button>
  );
}
