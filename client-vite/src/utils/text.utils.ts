export const beautifyText = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*([.,!?;:])\s*/g, "$1 ") // proper punctuation spacing
    .replace(/\s+([’'])/g, "$1") // fix apostrophes
    .replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase());
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
