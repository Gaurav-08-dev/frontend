
import type React from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";


interface Props {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const OutsideClickWrapper = ({
  onClose,
  children,
  className = "",
}: Props) => {
  const ref = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
