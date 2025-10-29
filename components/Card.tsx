
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold text-purple-300 border-b border-gray-700 pb-2 mb-3">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
