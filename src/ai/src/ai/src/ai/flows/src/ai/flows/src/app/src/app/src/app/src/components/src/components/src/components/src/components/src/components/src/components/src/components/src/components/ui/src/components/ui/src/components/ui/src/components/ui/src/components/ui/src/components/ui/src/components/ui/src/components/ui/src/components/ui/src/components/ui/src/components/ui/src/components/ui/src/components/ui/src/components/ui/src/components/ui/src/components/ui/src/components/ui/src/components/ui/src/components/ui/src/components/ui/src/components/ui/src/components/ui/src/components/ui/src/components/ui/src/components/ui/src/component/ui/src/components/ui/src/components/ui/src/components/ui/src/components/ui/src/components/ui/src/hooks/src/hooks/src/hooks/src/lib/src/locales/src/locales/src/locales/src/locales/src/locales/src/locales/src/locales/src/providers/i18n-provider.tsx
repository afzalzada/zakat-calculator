'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export const locales = [
    { code: 'en', name: 'English', dir: 'ltr', fontClass: 'font-body' },
    { code: 'ar', name: 'العربية', dir: 'rtl', fontClass: 'font-arabic' },
    { code: 'ur', name: 'اردو', dir: 'rtl', fontClass: 'font-urdu' },
    { code: 'ps', name: 'پښتو', dir: 'rtl', fontClass: 'font-pashto' },
    { code: 'fa', name: 'فارسی', dir: 'rtl', fontClass: 'font-persian' },
    { code: 'hi', name: 'हिन्दी', dir: 'ltr', fontClass: 'font-hindi' },
    { code: 'bn', name: 'বাংলা', dir: 'ltr', fontClass: 'font-bengali' },
] as const;

export type LocaleCode = typeof locales[number]['code'];

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as LocaleCode | null;
    if (savedLocale && locales.some(l => l.code === savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async (localeToLoad: LocaleCode) => {
      try {
        const translationsModule = await import(`@/locales/${localeToLoad}.json`);
        setTranslations(translationsModule.default);
      } catch (error) {
        console.error(`Could not load translations for locale: ${localeToLoad}`, error);
        const translationsModule = await import(`@/locales/en.json`);
        setTranslations(translationsModule.default);
      }
    };
    loadTranslations(locale);
  }, [locale]);
  
  const setLocale = (newLocale: string) => {
    const code = newLocale as LocaleCode;
    if (locales.some(l => l.code === code)) {
        setLocaleState(code);
        localStorage.setItem('locale', code);
    }
  }

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(new RegExp(`{{${optKey}}}`, 'g'), String(options[optKey]));
      });
    }
    return translation;
  }, [translations]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};
