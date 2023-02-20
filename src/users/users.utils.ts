export const uniqueDateNow = () => {
  return Number(String(Math.floor(Date.now())).slice(6));
};
