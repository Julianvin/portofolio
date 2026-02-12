import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Projects() {
  const { t } = useTranslation();
  useDocumentTitle(`${t('projects.title')} | Delvin Julian`);
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">{t('projects.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('projects.subtitle')}</p>
    </div>
  );
}
