import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Dashboard() {
  const { t } = useTranslation();
  useDocumentTitle(`${t('dashboard.title')} | Delvin Julian`);
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">{t('dashboard.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('dashboard.subtitle')}</p>
    </div>
  );
}
