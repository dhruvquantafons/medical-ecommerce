import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentProps<"div"> & {
  as?: "div" | "header" | "footer" | "main" | "nav" | "article";
};

/** The 1200px page container with the standard side gutter. Lay out content inside with a 12-column grid. */
export function Container({ as: Comp = "div", className, ...props }: ContainerProps) {
  return <Comp className={cn("mx-auto w-full max-w-site px-4 md:px-6", className)} {...props} />;
}
