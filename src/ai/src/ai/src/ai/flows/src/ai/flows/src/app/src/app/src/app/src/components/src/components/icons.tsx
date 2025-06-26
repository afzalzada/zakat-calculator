import type { LucideProps } from "lucide-react"
import { HandCoins } from "lucide-react"

export const Icons = {
  Logo: (props: LucideProps) => (
    <HandCoins {...props} />
  ),
  GoldBar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h12" />
    </svg>
  ),
  Sheep: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 12c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.1.4 2.1 1.2 2.8" />
      <path d="M19 19c-1.5-1.5-3.5-2-5.5-2s-4 .5-5.5 2" />
      <path d="M5 19c1.5-1.5 3.5-2 5.5-2s4 .5 5.5 2" />
      <path d="M12 12a3 3 0 0 0-3 3" />
      <path d="M12 12a3 3 0 0 1 3 3" />
      <path d="M9 10V8" />
      <path d="M15 10V8" />
    </svg>
  ),
};
