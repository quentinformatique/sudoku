const HEX_REGEX = /^#?[0-9a-fA-F]{6}$/;

export const isValidHex = (value: string) => HEX_REGEX.test(value.trim());

export const normalizeHex = (value: string) => {
  const trimmed = value.trim();
  if (!HEX_REGEX.test(trimmed)) {
    return null;
  }
  return trimmed.startsWith('#') ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
};
