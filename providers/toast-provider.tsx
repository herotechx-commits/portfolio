'use client';

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'rgb(51, 65, 85)',
          color: '#fff',
          border: '1px solid rgb(71, 85, 105)',
        },
      }}
      richColors
    />
  );
}