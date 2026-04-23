import type { MDXComponents } from "mdx/types";
import Mermaid from "@/components/Mermaid";

export function useMDXComponents(): MDXComponents {
  return {
    pre: ({ children, ...props }) => {
      const child = children as React.ReactElement<{
        className?: string;
        children?: string;
      }>;
      if (
        child?.props?.className === "language-mermaid" &&
        typeof child.props.children === "string"
      ) {
        return <Mermaid chart={child.props.children.trim()} />;
      }
      return <pre {...props}>{children}</pre>;
    },
  };
}
