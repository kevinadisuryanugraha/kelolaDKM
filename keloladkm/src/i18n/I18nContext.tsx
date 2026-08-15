import React, { createContext, useContext, useState } from 'react';
import id from './id';
import en from './en';

type Lang = 'id' | 'en';
const translations: Record<Lang, Record<string, any>> = { id, en };

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'id',
  setLang: () => {},
  t: () => '',
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem('dkm_lang') as Lang) || 'id'; }
    catch { return 'id'; }
  });

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[lang];
    for (const k of keys) { if (value?.[k] !== undefined) value = value[k]; else return path; }
    return String(value);
  };

  const changeLang = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem('dkm_lang', l); } catch {}
  };

  return <I18nContext.Provider value={{ lang, setLang: changeLang, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
