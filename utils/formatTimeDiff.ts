export const formatTimeDiff = (ms: number) => {
  const isNegative = ms < 0;
  const absMs = Math.abs(ms);

  const minutes = Math.floor(absMs / 60000);
  const seconds = Math.floor((absMs % 60000) / 1000);
  const milliseconds = absMs % 1000;

  return `${isNegative ? "-" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(milliseconds).padStart(3, "0")}`;
};
