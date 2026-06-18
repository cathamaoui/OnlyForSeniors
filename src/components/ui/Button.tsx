import { clsx } from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ember" | "outline";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  instruction?: string; // visible instruction text under the button
}

interface ButtonProps extends BaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface LinkProps extends BaseProps {
  href: string;
  type?: never;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ember: "btn-ember",
  outline: "btn-outline",
};

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", className, children, instruction, ...rest } =
    props as BaseProps & { [k: string]: unknown };

  const classes = clsx(variantClass[variant as Variant], className);

  if ("href" in props && props.href) {
    return (
      <span className="inline-flex flex-col items-stretch">
        <Link href={props.href} className={classes}>
          {children}
        </Link>
        {instruction && <span className="instruction">{instruction}</span>}
      </span>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <span className="inline-flex flex-col items-stretch">
      <button className={classes} {...buttonProps}>
        {children}
      </button>
      {instruction && <span className="instruction">{instruction}</span>}
    </span>
  );
}
