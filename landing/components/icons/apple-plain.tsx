import type { SVGProps } from "react";

export function ApplePlain({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* stem */}
      <path
        d="M12 5C12 5 12.5 2.5 15 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* body — symmetric, no bite */}
      <path d="M9 5C6 5 3 8 3 12.5C3 17.5 6 22 9.5 22C10.5 22 11.2 21.5 12 21.5C12.8 21.5 13.5 22 14.5 22C18 22 21 17.5 21 12.5C21 8 18 5 15 5C13.8 5 13 5.7 12 5.7C11 5.7 10.2 5 9 5Z" />
    </svg>
  );
}
