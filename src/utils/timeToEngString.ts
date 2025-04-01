export const timeToEngString = (timestamp: string): string => {
  const parts = timestamp.split(":");
  if (parts.length !== 2) {
    return "0m 0s";
  }

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  if (isNaN(minutes) || isNaN(seconds)) {
    return "0m 0s";
  }

  return `${minutes}m ${seconds}s`;
};
