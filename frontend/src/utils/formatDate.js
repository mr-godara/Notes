export const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

export const clampPreview = (value = '', length = 180) => {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}...`;
};
