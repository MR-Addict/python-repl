import { useRef, useState, useEffect } from "react";

export default function useDimensions<T extends Element = HTMLDivElement>(ref?: React.RefObject<T | null>) {
  if (!ref) ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      });
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref.current]);

  return [ref, dimensions] as const;
}
