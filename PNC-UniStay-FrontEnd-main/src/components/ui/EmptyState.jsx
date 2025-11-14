import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState({ icon: Icon, title, message, buttonText, buttonTo }) {
  return (
    <div className="text-center py-16 px-6 bg-gray-50 border-2 border-dashed rounded-lg">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-200 rounded-full">
          <Icon className="h-8 w-8 text-gray-500" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-2 mb-6">{message}</p>
      <Link 
        to={buttonTo} 
        className="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default EmptyState;