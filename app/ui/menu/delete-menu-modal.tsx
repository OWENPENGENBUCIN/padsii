'use client';

import React from 'react';
import { Button } from '@/app/ui/button';

type DeleteMenuModalProps = {
  onDelete: () => void;
  onCancel: () => void;
  isLoading: boolean;
};

export default function DeleteMenuModal({
  onDelete,
  onCancel,
  isLoading,
}: DeleteMenuModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-800">Konfirmasi Hapus</h2>
        <p
          className="mt-2 text-sm text-gray-600"
          style={{
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          Apakah Anda yakin ingin menghapus menu ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div className="mt-4 flex justify-end gap-4">
          <Button
            className="bg-gray-400 text-gray-700 hover:bg-gray-500"
            onClick={onCancel}
          >
            Batal
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}
