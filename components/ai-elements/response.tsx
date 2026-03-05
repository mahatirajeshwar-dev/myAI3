"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown, defaultRehypePlugins } from "streamdown";
import { rehypeSingleCharLink } from "@/lib/rehype-single-char-link";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      rehypePlugins={[
        defaultRehypePlugins.raw,
        defaultRehypePlugins.katex,
        rehypeSingleCharLink,
      ]}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
