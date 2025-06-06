import React from 'react';
import { Pencil } from 'lucide-react';

const EditButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white transition-colors ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-yellow-500 hover:bg-yellow-600'
      }`}
    >
      <Pencil size={16} />
      Edit
    </button>
  );
};

export default EditButton;
