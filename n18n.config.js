const supportedLngs = ['en', 'pt'];

export const ni18nConfig = {
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ['translation', 'home', 'sidebar', 'settings', 'releases'],
  react: {
    useSuspense: false
  }
};
