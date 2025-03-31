export function millisToFormattedTime(milliseconds: number) {
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
