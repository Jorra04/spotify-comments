export const getFirstValue = (str: string): string => {
  if (!str) return "";

  const parts = str.split("-");
  return parts[0] || "";
};
