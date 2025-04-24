import { DependencyList, useEffect, useRef } from "react";

export function useClickOutside<T extends Element = HTMLDivElement>(
  handler: (event?: MouseEvent | TouchEvent) => void,
  ref?: React.RefObject<T | null>,
  deps?: DependencyList
) {
  if (!ref) ref = useRef<T>(null);

  useEffect(() => {
    const innerListener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!target || !target.isConnected) return;
      if (ref.current && !ref.current.contains(target)) handler(event);
    };

    const outerListener = () => handler();

    document.addEventListener("mousedown", innerListener);
    document.addEventListener("touchstart", innerListener);
    window.addEventListener("blur", outerListener);

    return () => {
      document.removeEventListener("mousedown", innerListener);
      document.removeEventListener("touchstart", innerListener);
      window.removeEventListener("blur", outerListener);
    };
  }, deps);

  return ref;
}
