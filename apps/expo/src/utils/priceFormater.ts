const formatter = Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
});

export const formatPrice = (v: number | string | undefined | null) => {
  if (!v) return "";

  const n = Number(v);

  if (Number.isNaN(n)) return "";

  return formatter.format(n);
};
