'use client';

import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ZakatChatbot } from '@/components/zakat-chatbot';
import { I18nProvider } from '@/providers/i18n-provider';
import { useI18n } from '@/hooks/use-i18n';
import { locales } from '@/providers/i18n-provider';
import { cn } from '@/lib/utils';


const AppBody = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useI18n();
  const dir = locales.find(l => l.code === locale)?.dir || 'ltr';
  const fontClass = locales.find(l => l.code === locale)?.fontClass || 'font-body';

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <body className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontClass
    )}>
      {children}
      <ZakatChatbot />
      <Toaster />
    </body>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <I18nProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
            <title>Zakat Calculator</title>
            <meta name="description" content="An intelligent Zakat calculator and guide." />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Hind:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Pashto:wght@400;700&display=swap" rel="stylesheet" />

        </head>
        <AppBody>
          {children}
        </AppBody>
      </html>
    </I18nProvider>
  );
}
