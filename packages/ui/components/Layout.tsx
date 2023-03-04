import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {children}
    </div>
  );
}
