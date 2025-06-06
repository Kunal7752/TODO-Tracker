import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white transition-colors ${
        disabled
          ? 'bg-red-300 cursor-not-allowed'
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
};

export default DeleteButton;
