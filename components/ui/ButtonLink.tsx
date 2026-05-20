import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "editorial";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const variantClass = {
    primary: "button-primary",
    secondary: "button-secondary",
    editorial: "button-editorial"
  }[variant];

  return (
    <Link href={href} className={`button ${variantClass} ${className}`}>
      {children}
    </Link>
  );
}
