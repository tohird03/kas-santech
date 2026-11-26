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

const normalizePriceText = (value: string) => {
  let normalized = value.replace(/[\s\u00A0]/g, '').replace(/，/g, ',');
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

  return normalized.replace(/[^\d.-]/g, '');
};

/**
 * Nuqta — o'nlik. Bitta vergul faqat joylashtirilgan matnda nuqtaga aylanadi.
 * Yozish paytida vergul tugmasi alohida bloklanadi.
 */
export const parsePriceInput = (value?: string): number => {
  if (value == null || value.trim() === '') {
    return 0;
  }

  const compact = normalizePriceText(value);

  if (compact === '' || compact === '-' || compact === '.' || compact === '-.') {
    return 0;
  }

  const negative = compact.startsWith('-');
  const unsigned = negative ? compact.slice(1) : compact;
  const dotIndex = unsigned.indexOf('.');
  const intPart = dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
  const decPart = dotIndex === -1 ? '' : unsigned.slice(dotIndex + 1).replace(/\./g, '');
  const body = decPart ? `${intPart || '0'}.${decPart}` : (intPart || '0');
  const parsed = Number(`${negative ? '-' : ''}${body}`);

  return Number.isFinite(parsed) ? parsed : 0;
};

const cleanTypingInput = (raw: string) => {
  const compact = normalizePriceText(raw);

  if (
    compact === '' ||
    compact === '-' ||
    compact === '.' ||
    compact === '-.' ||
    compact.endsWith('.')
  ) {
    return compact;
  }

  const negative = compact.startsWith('-');
  const unsigned = negative ? compact.slice(1) : compact;
  const dotIndex = unsigned.indexOf('.');
  const intPart = dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
  const decPart = dotIndex === -1 ? '' : unsigned.slice(dotIndex + 1).replace(/\./g, '');
  const normalizedInt = intPart.replace(/^0+(?=\d)/, '') || '0';
  const body = dotIndex === -1 ? normalizedInt : `${normalizedInt}.${decPart}`;

  return `${negative ? '-' : ''}${body}`;
};

export const formatPriceInput = (
  value?: string | number | null,
  info?: {userTyping?: boolean, input?: string}
) => {
  if (info?.userTyping) {
    return cleanTypingInput(info.input ?? '');
  }

  return priceFormat(value);
};

const isZeroText = (value: string) => {
  const compact = value.replace(/[\s\u00A0]/g, '');

  return compact === '0' || compact === '0.0' || compact === '0.00' || compact === '0.000';
};

export const onPriceInputKeyDown = (event: {
  key: string;
  preventDefault: () => void;
  currentTarget: HTMLInputElement;
}) => {
  if (event.key === ',' || event.key === '，') {
    event.preventDefault();

    return;
  }

  if (event.key < '0' || event.key > '9') {
    return;
  }

  if (isZeroText(event.currentTarget.value)) {
    event.currentTarget.select();
  }
};

export const selectPriceZero = (event: {currentTarget: HTMLInputElement}) => {
  const input = event.currentTarget;

  if (!isZeroText(input.value)) {
    return;
  }

  window.setTimeout(() => {
    input.select();
  }, 0);
};

export const priceInputProps = {
  formatter: formatPriceInput,
  parser: parsePriceInput,
  onKeyDown: onPriceInputKeyDown,
  onFocus: selectPriceZero,
  onMouseUp: selectPriceZero,
};
