import { useEffect, useState } from "react";

export function useStableResponsiveLayout(
  layouts: ReactGridLayout.Layouts | null,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setWidth(containerRef.current.offsetWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  const ready = layouts != null && Object.keys(layouts).length > 0 && width != null;

  return { width, ready };
}
