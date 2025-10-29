
import React from 'react';

interface LoaderProps {
  large?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ large = false }) => {
  const sizeClass = large ? 'w-10 h-10' : 'w-5 h-5';
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-purple-400 ${sizeClass}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
