export const priceFormat = (price: string | number | null | undefined) => {
  if (!price) {
    return '0';
  }

  const numberPrice = Number(price);

  if (isNaN(numberPrice)) {
    return '0';
  }

  const formattedPrice = numberPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).replace(/,/g, ' ');

  return formattedPrice;
};

/**
 * Inputdagi summani songa aylantiradi.
 * Nuqta va bitta vergul — o'nlik (22,296 → 22.296).
 * Probel — minglik ajratuvchi (22 296 → 22296).
 * Standart InputNumber parser vergullarni tashlab, 22,296 ni 22296 qilib yuborardi.
 */
export const parsePriceInput = (value?: string): number => {
  if (value == null || value.trim() === '') {
    return 0;
  }

  let normalized = String(value).replace(/[\s\u00A0]/g, '');
  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    const commaCount = normalized.split(',').length - 1;

    normalized = commaCount > 1
      ? normalized.replace(/,/g, '')
      : normalized.replace(',', '.');
  }

  normalized = normalized.replace(/[^\d.-]/g, '');

  const negative = normalized.startsWith('-');
  const unsigned = normalized.replace(/-/g, '');
  const [integerPart, ...decimalParts] = unsigned.split('.');
  const body = decimalParts.length
    ? `${integerPart || '0'}.${decimalParts.join('')}`
    : integerPart;
  const parsed = Number(`${negative ? '-' : ''}${body}`);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatPriceInput = (
  value?: string | number | null,
  info?: {userTyping?: boolean, input?: string}
) => {
  if (info?.userTyping) {
    return info.input ?? '';
  }

  return priceFormat(value);
};
