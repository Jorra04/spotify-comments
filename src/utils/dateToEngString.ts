export const dateToEngString = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateObj.toLocaleDateString("en-US", options);

  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // 21st, 22nd, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return formattedDate.replace(
    /(\d+)(?=\s)/,
    (match) => `${match}${daySuffix(Number(match))}`
  );
};
