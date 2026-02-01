export const generateId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID()}`;
