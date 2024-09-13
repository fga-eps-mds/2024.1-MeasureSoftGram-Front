const supportedLngs = ['en', 'pt'];

export const ni18nConfig = {
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ['translation', 'home', 'about', 'sidebar', 'settings', 'releases', 'repositories', 'overview', 'header'],
  react: {
    useSuspense: false
  }
};
