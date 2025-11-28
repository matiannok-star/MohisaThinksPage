import { NavLink as RRNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, activeClassName, ...props }, ref) => {
    return (
      <RRNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          cn(className, isActive && activeClassName)
        }
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };