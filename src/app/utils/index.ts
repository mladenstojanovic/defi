import { useEffect, useState } from "react";

export const formatWad = (wadValue: string | bigint): string => {
  const value = Number((BigInt(wadValue) * BigInt(100)) / BigInt(1e18)) / 100;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function useDebounce<t>(value: t, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
