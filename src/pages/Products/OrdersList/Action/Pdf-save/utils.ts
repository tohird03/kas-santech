export const fixEncoding = (str: string) => {
  if (!str) return '';

  try {
    // Matnni baytlar massiviga aylantirish
    const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0)));

    // Windows-1251 (Kirill) kodirovkasidan UTF-8 ga o'tkazish
    const decoder = new TextDecoder('windows-1251');
    const decodedText = decoder.decode(bytes);

    // Agar natijada g'alati belgilar qolsa, originalini qaytaramiz
    return decodedText.includes('') ? str : decodedText;
  } catch (e) {
    return str;
  }
};
