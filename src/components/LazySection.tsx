import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type LazySectionProps = {
  loader: () => Promise<{ default: React.ComponentType }>;
  placeholder?: ReactNode;
  rootMargin?: string;
  once?: boolean;
};

export function LazySection({
  loader,
  placeholder = null,
  rootMargin = "500px 0px",
  once = true,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const Component = useMemo(() => lazy(loader), [loader]);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    if (shouldRender && once) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || cancelled) return;
        setShouldRender(true);
        if (once) {
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [once, rootMargin, shouldRender]);

  // After initial paint, warm the code split without forcing expensive rendering.
  useEffect(() => {
    if (shouldRender) return;

    let idleHandle = 0;
    const timeoutHandle = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleHandle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
          () => void loader(),
        );
      } else {
        void loader();
      }
    }, 1800);

    return () => {
      window.clearTimeout(timeoutHandle);
      if (idleHandle && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleHandle);
      }
    };
  }, [loader, shouldRender]);

  return (
    <div ref={hostRef}>
      {shouldRender ? (
        <Suspense fallback={placeholder}>
          <Component />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}

