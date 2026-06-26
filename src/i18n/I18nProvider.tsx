/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  translations,
  type Locale,
  type TranslationKey,
} from '@/i18n/translations';

type TranslationValues = Record<string, string | number>;
export type TranslateFn = (
  key: TranslationKey,
  values?: TranslationValues,
) => string;

interface I18nContextValue {
  locale: Locale;
  isRtl: boolean;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'gpmp-locale';
const localeOverrides: Partial<
  Record<Locale, Partial<Record<TranslationKey, string>>>
> = {
  ar: {
    projectsTableOwner: 'الطلبة',
    projectsTableSupervisor: 'المشرفون',
    projectStudent: 'الطلبة',
    projectSupervisor: 'المشرفون',
    projectAssignSupervisor: 'تعيين المشرفين',
    projectSupervisorPlaceholder: 'اختر من 1 إلى 3 مشرفين',
    projectAssignSupervisorButton: 'حفظ المشرفين',
    projectStudentTeam: 'فريق الطلبة',
    projectStudentTeamHelp:
      'أنت مضاف تلقائياً. أضف حتى طالبين آخرين ليصبح الحد الأقصى 3 طلبة في المشروع.',
    projectStudentTeamEmpty: 'لا يوجد زملاء مضافون بعد.',
    projectSupervisorSelectionHelp:
      'اختر من 1 إلى 3 مشرفين. سيتم استبدال القائمة الحالية بالكامل عند الحفظ.',
    projectAccessDenied: 'ليست لديك صلاحية للوصول إلى هذا المشروع.',
  },
};

function getInitialLocale(): Locale {
  const savedLocale = localStorage.getItem(STORAGE_KEY);

  if (savedLocale === 'ar' || savedLocale === 'en') {
    return savedLocale;
  }

  return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

function interpolate(template: string, values?: TranslationValues) {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce(
    (message, [key, value]) =>
      message.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const isRtl = locale === 'ar';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, locale);
  }, [isRtl, locale]);

  const t = useCallback<TranslateFn>(
    (key, values) => {
      const localeTranslations = translations[locale] as Partial<
        Record<TranslationKey, string>
      >;
      const template =
        localeOverrides[locale]?.[key] ??
        localeTranslations[key] ??
        translations.en[key] ??
        key;
      return interpolate(template, values);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      isRtl,
      setLocale,
      t,
    }),
    [isRtl, locale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider.');
  }

  return context;
}
