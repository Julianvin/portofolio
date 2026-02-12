import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Projects() {
  useDocumentTitle('Projects | Delvin Julian');
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-gray-600 dark:text-gray-400">Project gallery coming soon...</p>
    </div>
  );
}
