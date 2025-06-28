import { useEffect, useRef } from "react";

type Handler = () => void;

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  enableEscapeClose = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (enableEscapeClose && e.key === "Escape") {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [handler, enableEscapeClose]);

  return ref;
}
