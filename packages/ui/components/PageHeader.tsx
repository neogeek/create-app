import React from 'react';

export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="my-4 text-center text-2xl font-medium text-gray-900">
      {children}
    </h2>
  );
}
