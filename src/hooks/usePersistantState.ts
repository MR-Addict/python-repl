import { z } from "zod";
import { useEffect, useState } from "react";

const prefix = "persistant-state";

export default function usePersistantState<T>(
  key: string,
  defaultValue: T,
  validator?: z.ZodType<T> | ((value: T) => boolean)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const value = localStorage.getItem(`${prefix}-${key}`);
      if (!value) return defaultValue;

      const parsedValue = JSON.parse(value);
      if (!validator) return parsedValue;

      if (typeof validator === "function") {
        if (validator(parsedValue)) return parsedValue;
        return defaultValue;
      } else if (validator instanceof z.ZodType) {
        const result = validator.safeParse(parsedValue);
        if (result.success) return result.data;
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    const callback = () => localStorage.setItem(`${prefix}-${key}`, JSON.stringify(state));
    const timer = setTimeout(callback, 500);
    return () => clearTimeout(timer);
  }, [state, key]);

  return [state, setState];
}
