export const parseTime = (t: string) => {
  const [minutes, seconds, milliseconds] = t.split(":").map(Number);
  return (minutes * 60 + seconds) * 1000 + milliseconds;
};
