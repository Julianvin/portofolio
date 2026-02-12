import React from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ChatRoom() {
  const { t } = useTranslation();
  useDocumentTitle(`${t('chat.title')} | Delvin Julian`);
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">{t('chat.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('chat.subtitle')}</p>
    </div>
  );
}
