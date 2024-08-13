export type dateFormats = 'numeric' | 'long';

export const formatDate = (
  date: Date | number | string,
  format: 'numeric' | 'long' = 'long',
  locale = 'pt-BR'
): string => {
  const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    numeric: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }
  };

  try {
    const parsedDate = new Date(date);
    return new Intl.DateTimeFormat(locale, {
      ...formatMap[format],
      timeZone: 'UTC'
    }).format(parsedDate);
  } catch (error) {
    return '-';
  }
};

export const formatDateTime = (
  date: Date | number | string,
  format: dateFormats = 'long',
  locale = 'pt-BR'
): string => {
  const formatMap = {
    numeric: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      time: 'long'
    }
  };

  try {
    const formatedDate = new Intl.DateTimeFormat(locale, formatMap.numeric as Intl.DateTimeFormatOptions).format(
      new Date(date)
    );

    return formatedDate.replace(' ', ' às ');
  } catch (error) {
    return '-';
  }
};
